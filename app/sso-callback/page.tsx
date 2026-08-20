"use client";

import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const AFTER_AUTH = "/admin";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    void (async () => {
      if (!clerk.loaded || !signIn || !signUp || hasRun.current) return;
      hasRun.current = true;

      const go = (decorateUrl: (path: string) => string) => {
        const url = decorateUrl(AFTER_AUTH);
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      };

      const finalizeSignIn = async () => {
        await signIn.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            go(decorateUrl);
          },
        });
      };

      const finalizeSignUp = async () => {
        await signUp.finalize({
          navigate: async ({ session, decorateUrl }) => {
            if (session?.currentTask) return;
            go(decorateUrl);
          },
        });
      };

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if (signIn.status === "complete") {
          await finalizeSignIn();
          return;
        }
        router.push("/sign-in");
        return;
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
        router.push("/sign-in");
        return;
      }

      if (signUp.status === "complete") {
        await finalizeSignUp();
        return;
      }

      if (signUp.status === "missing_requirements") {
        try {
          await signUp.update({ legalAccepted: true });
        } catch {
          // Legal acceptance may already be off on this instance.
        }
        if (signUp.status === "complete") {
          await finalizeSignUp();
          return;
        }
      }

      if (signIn.existingSession || signUp.existingSession) {
        const sessionId =
          signIn.existingSession?.sessionId ||
          signUp.existingSession?.sessionId;
        if (sessionId) {
          await clerk.setActive({
            session: sessionId,
            navigate: async ({ session, decorateUrl }) => {
              if (session?.currentTask) return;
              go(decorateUrl);
            },
          });
          return;
        }
      }

      router.push("/sign-in");
    })();
  }, [clerk, router, signIn, signUp]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 text-sm text-slate-500">
      Completing Google sign-in…
      <div id="clerk-captcha" />
    </div>
  );
}
