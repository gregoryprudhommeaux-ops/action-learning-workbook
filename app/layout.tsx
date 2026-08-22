import type { Metadata } from "next";
import localFont from "next/font/local";
import { LocaleProvider } from "@/components/locale-provider";
import "./globals.css";

/** Self-hosted — no fonts.google.com (important for mainland China). */
const notoSansSc = localFont({
  src: [
    {
      path: "../public/fonts/NotoSansSC-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NotoSansSC-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-noto-sc",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Action Learning Workbook",
  description:
    "Pre-work for a live Action Learning audit: seven steps, one PDF pack.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${notoSansSc.variable} h-full antialiased`}>
      <body
        className={`${notoSansSc.className} flex min-h-full flex-col bg-slate-50 text-slate-800`}
      >
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
