import type { MockAuthState } from "@/mocks/types";

type SignInMode = "success" | "network-error" | "denied" | "token-error";

type Props = {
  mode: SignInMode;
  onModeChange: (mode: SignInMode) => void;
  isLoading: boolean;
  onSubmit: () => void;
  errorMessage: string | null;
  authState?: MockAuthState;
};

const OPTIONS: { value: SignInMode; label: string; description: string }[] = [
  {
    value: "success",
    label: "成功",
    description: "GitHubでの認可に成功し、トップページへ遷移します。"
  },
  {
    value: "network-error",
    label: "ネットワークエラー",
    description: "ネットワーク障害により失敗するパターンを確認します。"
  },
  {
    value: "denied",
    label: "ユーザーがキャンセル",
    description: "認可画面でキャンセルされたときの表示を確認します。"
  },
  {
    value: "token-error",
    label: "アクセストークン取得エラー",
    description: "GitHub OAuthのアクセストークン取得に失敗したケースです。"
  }
];

export function SignInView({
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
        <h2 className="text-2xl font-bold text-slate-900">GitHubでサインイン</h2>
        <p className="text-sm text-slate-600">
          下記のケースを選択して、サインインの挙動をモックデータで確認できます。
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          サインインシナリオ
        </h3>
        <div className="mt-4 space-y-3">
          {OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-brand"
            >
              <input
                type="radio"
                name="sign-in-mode"
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
          {isLoading ? "サインイン中..." : "GitHubでサインイン"}
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          現在のサインイン状態
        </h3>
        {authState?.status === "signed-in" ? (
          <div className="mt-2 text-sm text-slate-700">
            <p>
              サインイン中: <span className="font-semibold">{authState.userName}</span>
            </p>
            {authState.lastSignedInAt ? (
              <p className="text-slate-500">最終サインイン: {authState.lastSignedInAt}</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">現在はサインインしていません。</p>
        )}
      </div>
    </section>
  );
}
