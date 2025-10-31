# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

GitHubのmergeされたPRをリポジトリのコンテキストと組み合わせてTwitter likeにフィードするWebアプリ。バックエンドがRuby on Rails, フロントエンドがNext.js app routerで開発を行う。

## プロジェクト構成

- `/frontend` - Next.js 16 (App Router) フロントエンド
- `/git-feed-backend` - Rails 8 バックエンド API
- `/docs-site` - Docusaurus ドキュメントサイト ([https://git-feed-docusaurus.vercel.app/](https://git-feed-docusaurus.vercel.app/))
- `openapi.yml` - API スキーマ定義

## アーキテクチャ

### フロントエンド
- **Next.js App Router** でルーティング
- **Container/Presentational パターン** でコンポーネント分離
- **TanStack Query** で非同期データ管理
- **Tailwind CSS** でスタイリング

### バックエンド
- **Model/Service/Controller** の3レイヤーアーキテクチャ
  - Controller: リクエスト/レスポンス処理
  - Service: ビジネスロジック (API毎に作成)
  - Model: データアクセス層
- **Sidekiq** で非同期ジョブ処理 (フィード取得等)
- **Redis** でキャッシュ管理
- **PostgreSQL** でデータ永続化
- **OpenAPI (Rswag)** でスキーマ駆動開発

## 開発コマンド

### 基本コマンド (Taskfile)

```bash
# 両方の開発サーバーを起動
task dev

# フロントエンドのみ起動 (localhost:3000)
task dev:frontend

# バックエンドのみ起動 (Docker Compose)
task dev:backend

# サービス停止
task dev:down

# ログ確認
task dev:logs

# 依存関係のインストール
task install
```

### バックエンド (dip + Docker)

バックエンドコマンドは `dip` を使用 (Docker上でRailsコマンド実行)

```bash
# Rails console
task rails:console
# または: dip rails console

# コンテナのbash
task bash
# または: dip bash

# RuboCop (リンター)
task rubocop
# または: dip rubocop

# DB操作
task db:setup    # DB初期化
task db:migrate  # マイグレーション
task db:reset    # DBリセット

# 直接dipコマンド例
dip bundle install      # gem追加後
dip rails db:seed       # シードデータ投入
dip rails routes        # ルーティング確認
```

### フロントエンド

```bash
cd frontend

npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run lint   # ESLint
```

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

## 開発フロー

1. **API変更時**: `openapi.yml` を先に更新 (スキーマ駆動開発)
2. **バックエンド実装**: Service → Controller → Route の順で実装
3. **フロントエンド実装**: Container (ロジック) → Presentational (UI) の順で実装
4. **コード品質**: バックエンドは `dip rubocop` でチェック、フロントエンドは `npm run lint` でチェック
