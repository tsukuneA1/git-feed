import type { MockAuthState } from "@/mocks/types";

type SignUpMode = "success" | "no-account" | "creation-error";

type Props = {
  mode: SignUpMode;
  onModeChange: (mode: SignUpMode) => void;
  isLoading: boolean;
  onSubmit: () => void;
  errorMessage: string | null;
  authState?: MockAuthState;
};

const OPTIONS: { value: SignUpMode; label: string; description: string }[] = [
  {
    value: "success",
    label: "新規ユーザー作成が成功する",
    description: "アカウントが自動的に作成され、タグの初期設定に進みます。"
  },
  {
    value: "no-account",
    label: "GitHubアカウントを持っていない",
    description: "GitHubアカウントがないユーザー向けに注意喚起を表示します。"
  },
  {
    value: "creation-error",
    label: "ユーザー作成に失敗する",
    description: "システムエラー等でユーザー作成が失敗したケースを確認します。"
  }
];

export function SignUpView({
  mode,
  onModeChange,
  isLoading,
  onSubmit,
  errorMessage,
  authState
}: Props) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">GitHubでサインアップ</h2>
        <p className="text-sm text-slate-600">
          GitHub OAuthの想定パターンを選択し、初回サインアップ時の振る舞いを確認できます。
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          サインアップシナリオ
        </h3>
        <div className="mt-4 space-y-3">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-brand"
            >
              <input
                type="radio"
                name="sign-up-mode"
                value={option.value}
                checked={mode === option.value}
                onChange={() => onModeChange(option.value)}
                className="mt-1 h-4 w-4 border-slate-300 text-brand focus:ring-brand"
              />
              <div>
                <p className="font-semibold text-slate-900">{option.label}</p>
                <p className="text-sm text-slate-600">{option.description}</p>
              </div>
            </label>
          ))}
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="mt-6 w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "サインアップ中..." : "GitHubでサインアップ"}
        </button>
      </div>

      {authState?.welcomeMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-700">
          {authState.welcomeMessage}
        </div>
      ) : null}
    </section>
  );
}
