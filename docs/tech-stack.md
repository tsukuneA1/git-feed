# 技術選定

## フロントエンド

### Next.js App Router

フロントエンドのメインフレームワーク。多様なレンダリング手法を持ち、デファクトスタンダードなため採用。候補としてReact Routerを採用するかも悩んだが、Next.jsが最初からオールインワンなのに対し、React Routerはそれらを毎回組み込んでいく必要があり拡張性も考えて見送った。

### Container/Presentationalパターン

シンプルで学習コストが低いため採用。フロントエンドのcomponentsをContainerとPresentationalに2分割し、Containerがロジックと状態の制御を行い、そのpropsをPresentationalのcomponentsが受け取ってUIを表示する。フロントエンドがMVPではあまりファットになりそうでなかったこともありatomic designやfeature-sliced designは学習の負荷が高い割に、恩恵を享受しづらそうだった。

参考
- [Container/Presentationalパターン](https://zenn.dev/buyselltech/articles/9460c75b7cd8d1)
- [Atomic Design](https://zenn.dev/sunnyheee/articles/b5c8985af8407a)
- [feature-sliced design](https://zenn.dev/moneyforward/articles/e1ed48c3974811)

### TanStack Query

非同期データの状態管理ライブラリ。非同期処理を行うときはこのライブラリに入っている関数を必ず用いる。比較候補としてSWRがあるが、アプリ内で非同期処理が頻繁に発生する想定なため、より柔軟な非同期処理の戦略を取れるTanStack Queryを採用。

参考
- [【2023年】SWR & TanStack Query比較](https://zenn.dev/aishift/articles/288e4470cfc45e)

## バックエンド

