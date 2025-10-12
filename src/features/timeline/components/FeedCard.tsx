import type { MockFeedItem } from "@/mocks/types";
import { formatDiff, formatMergedAt, formatStarCount } from "@/utils/format";
import { TAG_LABEL_BY_ID } from "@/mocks/tagDictionary";

type Props = {
  feed: MockFeedItem;
};

export function FeedCard({ feed }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">{feed.title}</h3>
        <a
          href={feed.url}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          GitHubへ
        </a>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="font-medium text-slate-900">
          {feed.repository.owner} / {feed.repository.name}
        </span>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
          {feed.repository.language}
        </span>
        <span>★ {formatStarCount(feed.repository.stars)}</span>
        <span>{formatDiff(feed.additions, feed.deletions)}</span>
        <span>{formatMergedAt(feed.mergedAt)}</span>
      </div>
      <p className="mt-4 text-sm text-slate-700">{feed.repository.description}</p>
      <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        <div>
          <h4 className="font-semibold text-slate-900">変更概要</h4>
          <p className="mt-1 leading-6">{feed.changeSummary}</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">背景</h4>
          <p className="mt-1 leading-6">{feed.summary}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {feed.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {TAG_LABEL_BY_ID[tag] ?? tag}
          </span>
        ))}
      </div>
    </article>
  );
}
