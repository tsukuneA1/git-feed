type Props = {
  message: string;
  onNavigateSettings: () => void;
  actionLabel?: string;
};

export function TimelineTagNotice({
  message,
  onNavigateSettings,
  actionLabel = "タグ設定に移動"
}: Props) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-12 text-center">
      <p className="max-w-md text-sm text-slate-700">{message}</p>
      <button
        type="button"
        onClick={onNavigateSettings}
        className="rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        {actionLabel}
      </button>
    </section>
  );
}
