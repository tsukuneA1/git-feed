import type { MockTag } from "@/mocks/types";

type Props = {
  tags: MockTag[];
  selectedIds: string[];
  onToggleTag: (id: string) => void;
  onSave: () => void;
  isSaving: boolean;
  errorMessage: string | null;
  page: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
};

export function InitialTagSetupView({
  tags,
  selectedIds,
  onToggleTag,
  onSave,
  isSaving,
  errorMessage,
  page,
  totalPages,
  onNextPage,
  onPreviousPage
}: Props) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Step 1 of 2</p>
        <h2 className="text-2xl font-bold text-slate-900">興味のある領域を選択</h2>
        <p className="text-sm text-slate-600">
          タイムラインをあなた好みにするために、普段フォローしている技術やコミュニティを選んでください。保存すると、選んだタグに紐づくPRがタイムラインに表示されます。
        </p>
      </header>

      {errorMessage ? (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => {
          const checked = selectedIds.includes(tag.id);
          return (
            <li
              key={tag.id}
              onClick={() => onToggleTag(tag.id)}
              className="group flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <input
                type="checkbox"
                readOnly
                checked={checked}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
              />
              <div>
                <p className="font-semibold text-slate-900 group-hover:text-brand">{tag.label}</p>
                <p className="mt-1 text-sm text-slate-600">{tag.description}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
        <button
          type="button"
          onClick={onPreviousPage}
          disabled={page <= 1}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-400"
        >
          Back
        </button>
        <p className="text-sm text-slate-600">
          {page} / {totalPages} ページ
        </p>
        <button
          type="button"
          onClick={onNextPage}
          disabled={page >= totalPages}
          className="rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-400"
        >
          Next
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSaving ? "保存中..." : "タグを保存して次へ"}
        </button>
      </div>
    </section>
  );
}
