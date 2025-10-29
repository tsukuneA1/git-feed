# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

GitHubのmergeされたPRをリポジトリのコンテキストと組み合わせてTwitter likeにフィードするWebアプリ。バックエンドがRuby on Rails, フロントエンドがNext.js app routerで開発を行う。

## ドキュメント参照ガイド

### アーキテクチャ・設計
- [技術スタック (フロントエンド)](docs-site/docs/tech-stack/frontend.md) - Next.js App Router, TanStack Query, Container/Presentationalパターン
- [技術スタック (バックエンド)](docs-site/docs/tech-stack/backend.md) - Rails, Sidekiq, Redis, PostgreSQL
- [ER図](docs-site/docs/er-diagram.md) - データベース設計
- [シーケンス図: サインイン](docs-site/docs/sequence-diagram/signin-sequence.md) - GitHub OAuth認証フロー
- [シーケンス図: フィード取得](docs-site/docs/sequence-diagram/get-feed.md) - 非同期ジョブによるフィード取得処理

### 機能仕様
- [サインイン](docs-site/docs/functional-spec/signin.md) - GitHubサインイン機能
- [サインアップ](docs-site/docs/functional-spec/signup.md) - 新規アカウント作成
- [サインアウト](docs-site/docs/functional-spec/signout.md) - サインアウト機能
- [初回タグ選択](docs-site/docs/functional-spec/tag-initial-setting.md) - サインアップ時のタグ選択
- [タグ設定](docs-site/docs/functional-spec/tag-setting.md) - タグの変更
- [フィードタイムライン](docs-site/docs/functional-spec/feed-timeline.md) - PRカード表示
- [タイムラインのリロード](docs-site/docs/functional-spec/timeline-reload.md) - 新しいフィードの取得
- [タイムライン選択](docs-site/docs/functional-spec/timeline-select.md) - タグによる絞り込み

### ドメイン知識
- [PRスコアリング方針](docs-site/docs/domain/pr-scoring-method.md) - フィードの重要度判定ロジック
- [GitHubトークン管理](docs-site/docs/domain/github-token.md) - レートリミット・ノード制限の考慮事項

## 開発コマンド

```bash
# 両方の開発サーバーを起動
task dev

# フロントエンドのみ起動
task dev:frontend

# バックエンドのみ起動
task dev:backend

# 依存関係のインストール
task install
```
