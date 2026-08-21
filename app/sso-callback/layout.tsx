import { ClerkShell } from "@/components/auth/clerk-shell";

export default function SsoCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkShell>{children}</ClerkShell>;
}
