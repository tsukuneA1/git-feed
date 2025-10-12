import type { MockAuthState } from "@/mocks/types";

type SignOutMode = "success" | "network-error";

type Props = {
  authState?: MockAuthState;
  mode: SignOutMode;
  onModeChange: (mode: SignOutMode) => void;
  onSubmit: () => void;
  isLoading: boolean;
  errorMessage: string | null;
};

export function SignOutView({
  authState,
  mode,
  onModeChange,
  onSubmit,
  isLoading,
  errorMessage
}: Props) {
  const isSignedIn = authState?.status === "signed-in";

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">サインアウト</h2>
        <p className="text-sm text-slate-600">
          サインアウト時の挙動を切り替えて、通信エラーなどのケースを確認できます。
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          シナリオ
        </h3>
        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-brand">
            <input
              type="radio"
              name="signout-mode"
              value="success"
              checked={mode === "success"}
              onChange={() => onModeChange("success")}
              className="h-4 w-4 border-slate-300 text-brand focus:ring-brand"
            />
            <div>
              <p className="font-semibold text-slate-900">正常にサインアウトする</p>
              <p className="text-sm text-slate-600">サインアウト後、サインインページに戻ります。</p>
            </div>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 transition hover:border-brand">
            <input
              type="radio"
              name="signout-mode"
              value="network-error"
              checked={mode === "network-error"}
              onChange={() => onModeChange("network-error")}
              className="h-4 w-4 border-slate-300 text-brand focus:ring-brand"
            />
            <div>
              <p className="font-semibold text-slate-900">通信エラーが発生する</p>
              <p className="text-sm text-slate-600">
                サインアウトAPIが失敗するケース。エラー表示と再試行の動作を確認できます。
              </p>
            </div>
          </label>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!isSignedIn || isLoading}
          className="mt-6 w-full rounded bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "サインアウト中..." : "サインアウト"}
        </button>
      </div>

      {!isSignedIn ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          現在サインインしていません。サインアウトを確認するには、先にサインインしてください。
        </div>
      ) : null}
    </section>
  );
}
