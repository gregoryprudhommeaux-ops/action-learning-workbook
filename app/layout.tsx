import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Action Learning Workbook",
  description:
    "Pre-work for a live Action Learning audit: seven steps, one PDF pack.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-in"
          afterSignOutUrl="/sign-in"
          signInFallbackRedirectUrl="/admin"
          signUpFallbackRedirectUrl="/admin"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
