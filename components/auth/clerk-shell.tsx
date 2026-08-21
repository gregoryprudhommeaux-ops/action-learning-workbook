"use client";

import { ClerkProvider } from "@clerk/nextjs";

/** Clerk only for facilitator auth routes — keep off the public workbook. */
export function ClerkShell({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/sign-in"
      signInFallbackRedirectUrl="/admin"
      signUpFallbackRedirectUrl="/admin"
    >
      {children}
    </ClerkProvider>
  );
}
