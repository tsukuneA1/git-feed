import { differenceInDays, subDays } from "date-fns";
import type { MockFeedItem, MockTag } from "@/mocks/types";

export const MOCK_TAGS: MockTag[] = [
  { id: "typescript", label: "TypeScript", description: "静的型付けされたJavaScript" },
  { id: "javascript", label: "JavaScript", description: "Webの標準言語" },
  { id: "react", label: "React", description: "UI構築のためのライブラリ" },
  { id: "nextjs", label: "Next.js", description: "React製フレームワーク" },
  { id: "go", label: "Go", description: "Googleが開発した静的型付け言語" },
  { id: "rust", label: "Rust", description: "安全性と速度を両立した言語" },
  { id: "python", label: "Python", description: "汎用スクリプト言語" },
  { id: "ruby", label: "Ruby", description: "生産性に優れた言語" },
  { id: "java", label: "Java", description: "企業システムで広く利用" },
  { id: "kotlin", label: "Kotlin", description: "Android開発に最適な言語" },
  { id: "swift", label: "Swift", description: "Apple製品の開発向け" },
  { id: "android", label: "Android", description: "モバイル向けOS" },
  { id: "ios", label: "iOS", description: "AppleのモバイルOS" },
  { id: "devops", label: "DevOps", description: "開発と運用を繋ぐプラクティス" },
  { id: "infra", label: "Infrastructure", description: "クラウド・インフラ構築" },
  { id: "security", label: "Security", description: "セキュリティのベストプラクティス" },
  { id: "ml", label: "Machine Learning", description: "機械学習とAI" },
  { id: "data", label: "Data Engineering", description: "データ基盤と分析" },
  { id: "design", label: "Design", description: "プロダクトデザイン" },
  { id: "figma", label: "Figma", description: "コラボレーションデザインツール" },
  { id: "tailwind", label: "Tailwind CSS", description: "ユーティリティファーストCSS" },
  { id: "graphql", label: "GraphQL", description: "柔軟なAPIクエリ言語" },
  { id: "apollo", label: "Apollo", description: "GraphQLクライアント/サーバー" },
  { id: "testing", label: "Testing", description: "自動テスト全般" },
  { id: "storybook", label: "Storybook", description: "UIコンポーネントカタログ" },
  { id: "ci", label: "CI/CD", description: "継続的インテグレーション" },
  { id: "docker", label: "Docker", description: "コンテナ化プラットフォーム" },
  { id: "k8s", label: "Kubernetes", description: "コンテナオーケストレーション" },
  { id: "observability", label: "Observability", description: "システムの可観測性" },
  { id: "performance", label: "Performance", description: "パフォーマンス最適化" },
  { id: "flutter", label: "Flutter", description: "マルチプラットフォームUIツールキット" },
  { id: "svelte", label: "Svelte", description: "軽量なUIフレームワーク" },
  { id: "laravel", label: "Laravel", description: "PHP製フレームワーク" },
  { id: "elixir", label: "Elixir", description: "スケーラブルな関数型言語" },
  { id: "phoenix", label: "Phoenix", description: "Elixir製Webフレームワーク" },
  { id: "scala", label: "Scala", description: "JVMで動作する関数型言語" },
  { id: "dotnet", label: ".NET", description: "Microsoftの開発プラットフォーム" },
  { id: "cpp", label: "C++", description: "高性能なシステム言語" },
  { id: "csharp", label: "C#", description: ".NET主要言語" },
  { id: "unity", label: "Unity", description: "ゲーム開発エンジン" }
];

const baseDate = new Date();

function daysAgo(days: number) {
  return subDays(baseDate, days).toISOString();
}

export const MOCK_FEEDS: MockFeedItem[] = [
  {
    id: "1",
    title: "Improve hydration performance for streamed server components",
    url: "https://github.com/vercel/next.js/pull/55555",
    repository: {
      owner: "vercel",
      name: "next.js",
      language: "TypeScript",
      stars: 120000,
      description: "The React Framework for the Web"
    },
    tags: ["nextjs", "typescript", "performance"],
    summary:
      "Optimises RSC hydration by deferring script injection and reducing bundle duplication across streaming boundaries.",
    changeSummary:
      "Introduced targeted hydration queue and memoized resource manifest to eliminate redundant script tags.",
    additions: 450,
    deletions: 190,
    mergedAt: daysAgo(2)
  },
  {
    id: "2",
    title: "Add optimistic updates for PR review suggestions",
    url: "https://github.com/withastro/astro/pull/7777",
    repository: {
      owner: "withastro",
      name: "astro",
      language: "TypeScript",
      stars: 35000,
      description: "The web framework for content-driven websites"
    },
    tags: ["javascript", "design", "testing"],
    summary:
      "Enables instant UI feedback when submitting review suggestions by leveraging TanStack Query mutation lifecycle.",
    changeSummary:
      "Refactored review store to React Query, added error boundaries around mutation results, and improved loading states.",
    additions: 220,
    deletions: 75,
    mergedAt: daysAgo(3)
  },
  {
    id: "3",
    title: "Refine search filters for security advisory dashboard",
    url: "https://github.com/github/docs/pull/99999",
    repository: {
      owner: "github",
      name: "docs",
      language: "Ruby",
      stars: 15000,
      description: "Documentation for GitHub Products"
    },
    tags: ["security", "ruby"],
    summary:
      "Provides richer operator support when filtering advisories by dependency name and CVSS vector.",
    changeSummary:
      "Expanded filter parser to support nested expressions and simplified query builder API.",
    additions: 160,
    deletions: 40,
    mergedAt: daysAgo(5)
  },
  {
    id: "4",
    title: "Introduce infra drift detection alerts",
    url: "https://github.com/hashicorp/terraform/pull/12345",
    repository: {
      owner: "hashicorp",
      name: "terraform",
      language: "Go",
      stars: 39000,
      description: "Infrastructure as Code for managing cloud resources"
    },
    tags: ["go", "infra", "devops"],
    summary:
      "Adds periodic plan comparison to surface infrastructure drift and notify via webhook integration.",
    changeSummary:
      "Implemented drift scheduler, webhook notifier, and consolidated plan diff visualization.",
    additions: 510,
    deletions: 120,
    mergedAt: daysAgo(8)
  },
  {
    id: "5",
    title: "Enhance accessibility tooling within design system",
    url: "https://github.com/shopify/polaris/pull/54321",
    repository: {
      owner: "shopify",
      name: "polaris",
      language: "TypeScript",
      stars: 21000,
      description: "Shopify’s admin product component library"
    },
    tags: ["design", "typescript", "accessibility"],
    summary:
      "Brings built-in colour contrast suggestions and focus outlines to the Polaris component docs.",
    changeSummary:
      "Added WCAG validator integration, introduced focus ring helper utilities, and expanded doc examples.",
    additions: 320,
    deletions: 88,
    mergedAt: daysAgo(11)
  },
  {
    id: "6",
    title: "Streamline data ingestion for metrics pipeline",
    url: "https://github.com/datadog/dd-trace-go/pull/67890",
    repository: {
      owner: "DataDog",
      name: "dd-trace-go",
      language: "Go",
      stars: 8000,
      description: "Datadog APM client for Go"
    },
    tags: ["go", "observability", "data"],
    summary:
      "Reduces tail latency in ingestion by batching spans and introducing adaptive queue backpressure.",
    changeSummary:
      "Implemented channel pooling, adaptive batching thresholds, and observability dashboards.",
    additions: 280,
    deletions: 150,
    mergedAt: daysAgo(14)
  }
];

export const MOCK_RELOAD_FEEDS: MockFeedItem[] = [
  {
    id: "7",
    title: "Add streaming suspensions for Server Components",
    url: "https://github.com/facebook/react/pull/31415",
    repository: {
      owner: "facebook",
      name: "react",
      language: "TypeScript",
      stars: 215000,
      description: "The library for web and native user interfaces"
    },
    tags: ["react", "javascript", "performance"],
    summary:
      "Introduces granular streaming suspensions to avoid tearing when data waterfalls occur.",
    changeSummary:
      "Refined scheduler priorities, added suspense boundary heuristics, and updated integration tests.",
    additions: 610,
    deletions: 210,
    mergedAt: daysAgo(1)
  },
  {
    id: "8",
    title: "Add WASM-powered syntax highlighting",
    url: "https://github.com/shikijs/shiki/pull/8822",
    repository: {
      owner: "shikijs",
      name: "shiki",
      language: "TypeScript",
      stars: 25000,
      description: "A beautiful syntax highlighter"
    },
    tags: ["typescript", "performance", "design"],
    summary:
      "Ships WebAssembly highlighter that improves render time on large markdown files by 3x.",
    changeSummary:
      "Introduced wasm pipeline, added language fallback options, and integrated streaming tokenizer.",
    additions: 710,
    deletions: 300,
    mergedAt: daysAgo(1)
  }
];

export function computeRelativeDays(isoDate: string) {
  return differenceInDays(new Date(), new Date(isoDate));
}
