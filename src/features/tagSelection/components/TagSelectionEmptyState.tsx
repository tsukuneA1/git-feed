type Props = {
  onOpenSettings: () => void;
};

export function TagSelectionEmptyState({ onOpenSettings }: Props) {
  return (
    <section className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h3 className="text-xl font-semibold text-slate-900">タグが設定されていません</h3>
      <p className="max-w-md text-sm text-slate-600">
        最初にタグ設定画面で興味のあるタグを設定してからタイムライン選択に戻ってきてください。
      </p>
      <button
        type="button"
        onClick={onOpenSettings}
        className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        タグ設定へ移動
      </button>
    </section>
  );
}
