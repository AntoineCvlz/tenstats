import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "tenstats — tennis analytics",
  description: "Match, ranking and Elo analytics for the ATP and WTA tours.",
};

// The props are typed explicitly rather than with the generated `LayoutProps`
// helper so that `tsc --noEmit` can run before `next build` in CI.
export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
