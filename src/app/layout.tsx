import "@/styles/globals.css";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { LayoutShell } from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "Git Feed Demo",
  description: "Mocked frontend demo for Git Feed"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ReactQueryProvider>
          <LayoutShell>{children}</LayoutShell>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
