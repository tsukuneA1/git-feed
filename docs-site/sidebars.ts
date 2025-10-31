import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '技術スタック',
      items: ['tech-stack/frontend', 'tech-stack/backend'],
    },
    'er-diagram',
    {
      type: 'category',
      label: 'シーケンス図',
      items: ['sequence-diagram/signin-sequence', 'sequence-diagram/get-feed'],
    },
    {
      type: 'category',
      label: '機能仕様',
      items: [
        'functional-spec/signin',
        'functional-spec/signup',
        'functional-spec/signout',
        'functional-spec/tag-initial-setting',
        'functional-spec/tag-setting',
        'functional-spec/feed-timeline',
        'functional-spec/timeline-reload',
        'functional-spec/timeline-select',
      ],
    },
    {
      type: 'category',
      label: 'ドメイン知識',
      items: ['domain/pr-scoring-method', 'domain/github-token'],
    },
    {
      type: 'category',
      label: 'ページ設計',
      items: ['pages/tag-setting-page'],
    },
  ],
};

export default sidebars;
