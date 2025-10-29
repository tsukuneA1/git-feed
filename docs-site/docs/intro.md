---
sidebar_position: 1
title: はじめに
slug: /
---

# git-feed

GitHubのmergeされたPRをリポジトリのコンテキストと組み合わせてTwitter likeにフィードするWebアプリケーションです。

## プロジェクト概要

人気のOSSリポジトリのPRを自動収集し、AI要約とスコアリングによって重要度を判定してフィード形式で表示します。

## 技術スタック

- **フロントエンド**: Next.js App Router, TanStack Query
- **バックエンド**: Ruby on Rails, Sidekiq, Redis, PostgreSQL
- **認証**: GitHub OAuth (PKCE)
- **データ取得**: GitHub GraphQL API

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

## ドキュメント構成

- **技術スタック**: フロントエンドとバックエンドの技術選定理由
- **ER図**: データベース設計
- **シーケンス図**: サインインとフィード取得のフロー
- **ドメイン知識**: PRスコアリングとGitHubトークン管理
