"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import { fetchAuth } from "@/mocks/mockServer";

type Props = {
  children: ReactNode;
};

const NAV_LINKS = [
  { href: "/", label: "タイムライン" },
  { href: "/timeline/select", label: "タイムライン選択" },
  { href: "/tags/settings", label: "タグ設定" }
];

export function LayoutShell({ children }: Props) {
  const pathname = usePathname();
  const { data: authState } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchAuth
  });

  const isSignedIn = authState?.status === "signed-in";

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold text-brand">
            Git Feed
          </Link>
          <nav className="flex gap-4 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded px-3 py-2 font-medium transition-colors hover:bg-slate-100",
                  pathname === link.href
                    ? "bg-brand text-white hover:bg-brand-dark"
                    : "text-slate-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <>
                <span className="text-sm text-slate-600">
                  サインイン中:{" "}
                  <span className="font-semibold text-slate-900">
                    {authState?.userName ?? "ユーザー"}
                  </span>
                </span>
                <Link
                  href="/signout"
                  className="rounded border border-brand px-3 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                >
                  サインアウト
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  サインアップ
                </Link>
                <Link
                  href="/signin"
                  className="rounded border border-brand px-3 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
                >
                  サインイン
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
