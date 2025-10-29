# git-feed

GitHubのmergeされたPRをリポジトリのコンテキストと組み合わせてTwitter likeにフィードするWebアプリケーション。

## ドキュメント

プロジェクトの詳細なドキュメントはDocusaurusサイトをご覧ください：

**[https://git-feed-docusaurus.vercel.app/](https://git-feed-docusaurus.vercel.app/)**

ドキュメントには以下が含まれます：

- **技術スタック** - フロントエンド（Next.js）・バックエンド（Rails）の技術選定理由
- **アーキテクチャ設計** - ER図、シーケンス図
- **機能仕様** - Gherkin形式の詳細な機能定義
- **ドメイン知識** - PRスコアリング方針、GitHubトークン管理

## 技術スタック

- **フロントエンド**: Next.js App Router, TanStack Query
- **バックエンド**: Ruby on Rails, Sidekiq, Redis, PostgreSQL
- **認証**: GitHub OAuth (PKCE)
- **データ取得**: GitHub GraphQL API

## ドキュメントの開発

```bash
cd docs-site

# 開発サーバー起動
npm start

# ビルド
npm run build
```
