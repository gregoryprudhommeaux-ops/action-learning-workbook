import { ClerkShell } from "@/components/auth/clerk-shell";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkShell>{children}</ClerkShell>;
}
