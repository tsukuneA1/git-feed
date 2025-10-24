本プロジェクトはGitHubのデータをFeedしてくるため、GitHubのAPIを定期的にたたく必要がある。このとき、GitHubのパーソナルアクセストークンを使用して、publicなリポジトリに対して検索を掛ける。

パーソナルアクセストークンには**レートリミット(リクエストの上限)**と**ノード制限(1リクエストのデータ量の上限)**の2つの制限がある。

## レートリミットについて
レートリミットは単純なリクエスト回数ではなく、**ポイント**という単位で上限が設定されており、簡単なクエリは1ポイント、複雑なクエリはより多くのポイントを消費する。1時間当たりのポイントの上限が5,000件である。出来るだけ使用ポイントが低くなるようにクエリを設計する必要がある。

## ノード制限について
GraphQLのクエリは木構造で、そのオブジェクトの中のノードの総数の上限が最大500,000個である。

## 実験
以下のpythonで書いたクエリで1リクエスト(50リポジトリに対して、20PR取得する)が1ポイントだった。
### pythonコード
```python
import os
import csv
import time
import random
import requests
from datetime import datetime, timedelta, timezone

GITHUB_TOKEN = "hogehoge"
ENDPOINT = "https://api.github.com/graphql"
if not GITHUB_TOKEN:
    raise SystemExit("GITHUB_TOKEN が未設定です。")

TARGET_COUNT = 500      # 取りたい repo 数
WINDOW_DAYS   = 90      # 作成日のランダム窓幅
MAX_WINDOWS   = 200     # 試す窓数の上限
PRS_PER_REPO  = 20      # リポジトリ毎に取得するPR数

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
}

QUERY = """
query($q: String!, $after: String, $prs: Int!) {
  rateLimit { cost remaining resetAt }
  search(query: $q, type: REPOSITORY, first: 50, after: $after) {
    repositoryCount
    pageInfo { hasNextPage endCursor }
    edges {
      node {
        ... on Repository {
          id
          nameWithOwner
          url
          stargazerCount
          isPrivate
          isArchived
          createdAt
          pullRequests(
            first: $prs
            orderBy: {field: CREATED_AT, direction: DESC}
            states: [OPEN, MERGED, CLOSED]
          ) {
            nodes {
              number
              title
              url
              state
              createdAt
              mergedAt
              closedAt
              author { login }
            }
          }
        }
      }
    }
  }
}
"""

def run_query(q, after=None):
    variables = {"q": q, "after": after, "prs": PRS_PER_REPO}
    r = requests.post(ENDPOINT, json={"query": QUERY, "variables": variables},
                      headers=headers, timeout=60)
    r.raise_for_status()
    data = r.json()
    if "errors" in data:
        raise RuntimeError(data["errors"])
    return data["data"]

def maybe_backoff(rl):
    """レートリミットが近い場合に待機する"""
    remaining = rl["remaining"]
    reset_at = datetime.fromisoformat(rl["resetAt"].replace("Z", "+00:00"))
    if remaining < 150:
        now = datetime.now(timezone.utc)
        wait = max(5, min(30, int((reset_at - now).total_seconds())))
        print(f"[rateLimit] remaining={remaining}, sleep {wait}s")
        time.sleep(wait)

def random_created_windows(start_year=2008):
    """検索期間のウィンドウをランダムな順序で生成する"""
    start = datetime(start_year, 1, 1, tzinfo=timezone.utc)
    end = datetime.now(timezone.utc)
    windows = []
    cur = start
    delta = timedelta(days=WINDOW_DAYS)
    while cur < end:
        win_end = min(cur + delta, end)
        windows.append((cur.date(), win_end.date()))
        cur = win_end
    random.shuffle(windows)
    return windows

def main():
    out = open("all_10kstar_prs3.csv", "w", newline="", encoding="utf-8")
    writer = csv.writer(out)
    writer.writerow([
        "repo_id", "repo_name_with_owner", "repo_url", "stars",
        "repo_created_at", "is_private", "is_archived",
        "pr_number", "pr_title", "pr_url", "pr_state",
        "pr_created_at", "pr_merged_at", "pr_closed_at", "pr_author_login"
    ])

    seen_repo_ids = set()
    total_written = 0
    picked = 0

    for i, (d1, d2) in enumerate(random_created_windows(), start=1):
        if i > MAX_WINDOWS or picked >= TARGET_COUNT:
            break

        q = f"stars:>10000 is:public created:{d1}..{d2}"
        print(f"[window {i}] query='{q}'")
        after = None
        page = 0

        while True:
            data = run_query(q, after)
            rl = data["rateLimit"]
            
            print(f"   [API] cost: {rl['cost']}, remaining: {rl['remaining']}")

            maybe_backoff(rl)

            search = data["search"]
            page += 1

            for edge in search["edges"]:
                repo = edge["node"]
                if not repo or repo["isPrivate"] or repo["isArchived"]:
                    continue
                if repo["id"] in seen_repo_ids:
                    continue

                seen_repo_ids.add(repo["id"])
                picked += 1

                for pr in repo["pullRequests"]["nodes"]:
                    writer.writerow([
                        repo["id"], repo["nameWithOwner"], repo["url"], repo["stargazerCount"],
                        repo["createdAt"], repo["isPrivate"], repo["isArchived"],
                        pr["number"], pr["title"], pr["url"], pr["state"],
                        pr["createdAt"], pr["mergedAt"], pr["closedAt"],
                        (pr["author"]["login"] if pr["author"] else None),
                    ])
                    total_written += 1

                if picked >= TARGET_COUNT:
                    break

            print(f"   page {page}: repoCount~{search['repositoryCount']}, picked={picked}, rows={total_written}")

            if picked >= TARGET_COUNT:
                break
            if search["pageInfo"]["hasNextPage"]:
                after = search["pageInfo"]["endCursor"]
            else:
                break

    out.close()
    print(f"Done. repos(picked)={picked}, rows={total_written}, file=all_10kstar_prs.csv")

if __name__ == "__main__":
    main()
```

実行結果
```
 python3 graphql.py
[window 1] query='stars:>10000 is:public created:2019-08-01..2019-10-30'
   [API] cost: 1, remaining: 4971
   page 1: repoCount~71, picked=50, rows=972
   [API] cost: 1, remaining: 4970
   page 2: repoCount~71, picked=71, rows=1342
[window 2] query='stars:>10000 is:public created:2018-11-04..2019-02-02'
   [API] cost: 1, remaining: 4969
   page 1: repoCount~97, picked=121, rows=2340
   [API] cost: 1, remaining: 4968
   page 2: repoCount~97, picked=164, rows=3171
[window 3] query='stars:>10000 is:public created:2009-03-26..2009-06-24'
   [API] cost: 1, remaining: 4967
   page 1: repoCount~10, picked=172, rows=3331
[window 4] query='stars:>10000 is:public created:2010-03-21..2010-06-19'
   [API] cost: 1, remaining: 4966
   page 1: repoCount~23, picked=195, rows=3791
[window 5] query='stars:>10000 is:public created:2014-02-28..2014-05-29'
   [API] cost: 1, remaining: 4965
   page 1: repoCount~95, picked=241, rows=4697
   [API] cost: 1, remaining: 4964
   page 2: repoCount~95, picked=285, rows=5561
[window 6] query='stars:>10000 is:public created:2013-11-30..2014-02-28'
   [API] cost: 1, remaining: 4963
   page 1: repoCount~77, picked=333, rows=6521
   [API] cost: 1, remaining: 4962
   page 2: repoCount~77, picked=359, rows=7041
[window 7] query='stars:>10000 is:public created:2013-03-05..2013-06-03'
   [API] cost: 1, remaining: 4961
   page 1: repoCount~75, picked=408, rows=8021
   [API] cost: 1, remaining: 4960
   page 2: repoCount~75, picked=430, rows=8461
[window 8] query='stars:>10000 is:public created:2012-06-08..2012-09-06'
   [API] cost: 1, remaining: 4959
   page 1: repoCount~58, picked=478, rows=9421
   [API] cost: 1, remaining: 4958
   page 2: repoCount~58, picked=484, rows=9541
[window 9] query='stars:>10000 is:public created:2015-11-20..2016-02-18'
   [API] cost: 1, remaining: 4957
   page 1: repoCount~119, picked=500, rows=9861
Done. repos(picked)=500, rows=9861, file=all_10kstar_prs.csv
```
