# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

GitHubのmergeされたPRをリポジトリのコンテキストと組み合わせてTwitter likeにフィードするWebアプリ。バックエンドがRuby on Rails, フロントエンドがNext.js app routerで開発を行う。

## ドキュメント参照ガイド

### アーキテクチャ・設計
- [技術スタック (フロントエンド)](docs/tech-stack/frontend.md) - Next.js App Router, TanStack Query, Container/Presentationalパターン
- [技術スタック (バックエンド)](docs/tech-stack/backend.md) - Rails, Sidekiq, Redis, PostgreSQL
- [ER図](docs/er-diagram.md) - データベース設計
- [シーケンス図: サインイン](docs/sequence-diagram/signin-sequence.md) - GitHub OAuth認証フロー
- [シーケンス図: フィード取得](docs/sequence-diagram/get-feed.md) - 非同期ジョブによるフィード取得処理

### ドメイン知識
- [PRスコアリング方針](docs/domain/pr-scoring-method.md) - フィードの重要度判定ロジック
- [GitHubトークン管理](docs/domain/github-token.md) - レートリミット・ノード制限の考慮事項

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
