---
sidebar_position: 1
title: タグ設定ページ
---

# タグ設定ページ

## 画面パス

`/settings/tag-setting`

## クエリパラメータ

| パラメータ | 型 | 説明 | デフォルト |
| --- | --- | --- | --- |
| page | number | 表示中のページ番号 | 1 |
| search | string | タグ名の検索キーワード | なし |

## 画面フロー

1. ページ遷移直後にタグ候補のページ1（最大20件）を取得する。
2. 表示中のページから Next/Back 操作でページ番号を変更し、タグリストを再取得する。
3. 検索ボックスにキーワードを入力すると、バックエンドで部分一致検索を行い、結果をページ1から表示する。
4. タグの選択・解除はクライアント側状態を更新し、保存ボタン押下で永続化 API を叩く。
5. 保存成功時は通知を表示し、ユーザーはページを維持したまま次の操作へ移る。
6. 保存リクエストが失敗した場合はエラー内容を画面に表示して再入力を促す。

## OpenAPI I/O マッピング

| 利用シーン | Method | Endpoint | 入力パラメータ | 主なレスポンス |
| --- | --- | --- | --- | --- |
| タグ候補の取得 | GET | /tags | page, perPage (default 20), search (optional) | 200 with TagPage (items, page, totalPages, selectedTagIds) |
| 現在の選択状態取得 | GET | /users/me/tag-selections | なし | 200 with TagSelection (tagIds) |
| 選択内容の保存 | PUT | /users/me/tag-selections | TagSelectionUpdate (tagIds) | 200 with TagSelection / 204 |
