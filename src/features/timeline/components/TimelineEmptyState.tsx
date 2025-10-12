type Props = {
  onOpenTagSelection: () => void;
};

export function TimelineEmptyState({ onOpenTagSelection }: Props) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="text-xl font-semibold text-slate-900">
        選択中のタグに該当するPRがありません
      </h3>
      <p className="max-w-md text-sm text-slate-600">
        タグを選び直すと、より幅広いPRをタイムラインに表示できます。特定のタグのみ選んでいる場合は、他のタグも試してみてください。
      </p>
      <button
        type="button"
        onClick={onOpenTagSelection}
        className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        タグを選び直す
      </button>
    </section>
  );
}
