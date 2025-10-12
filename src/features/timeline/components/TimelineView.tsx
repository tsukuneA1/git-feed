import type { MockFeedItem } from "@/mocks/types";
import { FeedCard } from "./FeedCard";
import { format } from "date-fns";

type Props = {
  feeds: MockFeedItem[];
  lastUpdated: string;
  tagLabels: string[];
  onReload: () => void;
  isReloading: boolean;
  reloadError: string | null;
  onOpenTagSelection: () => void;
};

export function TimelineView({
  feeds,
  lastUpdated,
  tagLabels,
  onReload,
  isReloading,
  reloadError,
  onOpenTagSelection
}: Props) {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">あなたのタイムライン</h2>
          <p className="mt-1 text-sm text-slate-600">
            選択中のタグ:{" "}
            <span className="font-medium text-slate-900">{tagLabels.join(" / ")}</span>
          </p>
          <p className="text-xs text-slate-500">
            最終更新: {format(new Date(lastUpdated), "yyyy/MM/dd HH:mm")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenTagSelection}
            className="rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            タグを選び直す
          </button>
          <button
            type="button"
            onClick={onReload}
            disabled={isReloading}
            className="flex items-center gap-2 rounded bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isReloading ? "更新中..." : "リロード"}
          </button>
        </div>
      </header>

      {reloadError ? (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {reloadError}
        </div>
      ) : null}

      <div className="grid gap-5">
        {feeds.map((feed) => (
          <FeedCard key={feed.id} feed={feed} />
        ))}
      </div>
    </section>
  );
}
