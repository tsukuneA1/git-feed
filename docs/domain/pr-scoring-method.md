# PRスコアリング方針（ヒューリスティック実験案）

## 目的
PR単位のFeedから価値の高い更新を抽出し、タイムラインのノイズを下げる。ここでは実験で利用する具体的なスコア計算式を定義する。

## スコア算出フロー概要
最終スコア `S` を 0〜100 に正規化し、`S >= 70` を主要枠、`40 <= S < 70` を通常枠、`S < 40` を軽微枠として扱う。計算ステップは以下の通り。

1. GitHub API（GraphQLまたはREST）で必要なメトリクスを取得。
2. 各シグナルを 0〜1 の範囲に正規化して部分スコアを算出。
3. 重みづけして合算し、0〜100 にクリップ。
4. 結果を Feed テーブル（`importance_score` 数値列、`importance_class` enum）に保存。

`S = clamp(0, 100, W_size + W_review + W_fresh + W_files + W_labels + W_ai)`

## 入力シグナルと指標

### 1. 規模（Size）
- 入力: `additions`, `deletions`, `changedFiles`.
- 派生値:
  - `lines = additions + deletions`
  - `size_norm = min(1, log1p(lines) / log1p(1500))`
  - `files_norm = min(1, log1p(changedFiles) / log1p(25))`
- スコア: `W_size = 35 * (0.7 * size_norm + 0.3 * files_norm)`

### 2. レビュー活発度（Review Activity）
- 入力: `comments.totalCount`, `reviews.totalCount`, `participants.totalCount`
  - GraphQL: `pullRequest { comments { totalCount } reviews { totalCount } participants(first: 1) { totalCount } }`
- 派生値:
  - `comments_norm = min(1, log1p(comments) / log1p(40))`
  - `reviews_norm = min(1, log1p(reviews) / log1p(12))`
  - `participants_norm = min(1, participants / 10)`
- スコア: `W_review = 20 * (0.5 * comments_norm + 0.3 * reviews_norm + 0.2 * participants_norm)`

### 3. タイムスタンプ（Freshness）
- 入力: `mergedAt`
- 派生値:
  - `hours_since_merge = max(0, (now - mergedAt) / 1hour)`
  - `fresh_factor = exp(-hours_since_merge / 72)` （3日で約0.37, 1週間で約0.14）
- スコア: `W_fresh = 15 * fresh_factor`

### 4. ファイル種別（File Mix）
- 入力: PRファイル一覧 `pullRequest { files(first: 100) { nodes { path additions deletions } } }`
- 事前に拡張子カテゴリを定義。例:
  - `CODE_EXT = {".ts", ".tsx", ".js", ".py", ".rb", ...}`
  - `DOC_EXT = {".md", ".rst"}` 等
- 派生値:
  - `code_lines = Σ(additions+deletions of CODE_EXT)`
  - `doc_lines = Σ(... of DOC_EXT)`
  - `total_lines = code_lines + doc_lines`
  - `code_ratio = total_lines == 0 ? 0 : code_lines / total_lines`
- スコア: `W_files = 10 * code_ratio - 5 * (1 - code_ratio)`
  - コード比率が低いと減点。コード100%で +10, ドキュメントのみで -5。

### 5. ラベル（Labels）
- 入力: `labels(first: 20) { nodes { name } }`
- スコアマップ（複数ラベルの場合は合算し、-6〜+10にクリップ）:
  - 重大系: `{breaking-change, security, critical, hotfix}` → +8
  - 機能追加: `{feature, enhancement, release}` → +5
  - 改善系: `{performance, refactor, optimization}` → +3
  - バグ修正: `{bugfix, bug}` → +4
  - 保守系: `{chore, maintenance, dependencies}` → -2
  - 文書/CI: `{documentation, docs, ci, workflow}` → -4
- 未知ラベルは 0。
- `W_labels = clamp(-6, 10, Σ label_score)`

### 6. AI分類（AI Classification）
- サマリ生成と同時に以下の分類を求める（プロンプト例は別途定義）。
  - `Major`, `Moderate`, `Minor`, `Docs`, `Chore`, `Uncertain`
- スコア割当:
  - `Major`: +12
  - `Moderate`: +6
  - `Minor`: +0
  - `Docs` / `Chore`: -6
  - `Uncertain`: +2（軽い加点）
- 低信頼（AI回答に`confidence: low`などが含まれる）場合は係数0.5倍。
- `W_ai = score_map[class] * (confidence < 0.6 ? 0.5 : 1)`

## 最終判定
- `S >= 70`: 「ハイライト」に掲載。通知候補。
- `40 <= S < 70`: 通常タイムライン。
- `S < 40`: デフォルト非表示。ユーザーが「軽微更新を表示」を選んだときのみ提示。
- どのシグナルも取得できない場合はデフォルトスコア `S = 30` を付与し軽微扱いとする。

## データ保存
- `Feed#importance_score` : decimal(5,2) など。0〜100。
- `Feed#importance_class` : enum(`highlight`, `normal`, `minor`)。
- スコア計算はSidekiqジョブで要約と同じタイミングに実行し、結果を更新する。

## 実験手順のメモ
1. GitHub GraphQL APIで任意のリポジトリのPRを取得（30〜50件）。
2. 上記式でスコアを算出するスクリプトを作成。
3. スコア分布をヒストグラムで確認し、閾値と重みを調整。
4. 軽微と判定されたPRを目視で確認し、誤判定が多ければ係数を修正。
5. Likeなどのフィードバックを取得できるようになったら、閾値補正に利用。

## 今後の拡張ポイント
- 重要ディレクトリのホワイトリスト／ブラックリストを追加し、`W_files` に反映。
- コミットメッセージやIssue連携から追加シグナルを取得。
- ヒューリスティックから学習モデルへ移行する際の教師データ・評価指標（Precision/Recallなど）を設計。
