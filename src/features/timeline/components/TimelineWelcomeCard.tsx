type Props = {
  message: string;
  onDismiss: () => void;
  onStartSetup: () => void;
};

export function TimelineWelcomeCard({ message, onDismiss, onStartSetup }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700 shadow-sm">
      <p>{message}</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onStartSetup}
          className="rounded bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          タグを設定する
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
