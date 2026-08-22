import { ClerkShell } from "@/components/auth/clerk-shell";

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkShell>{children}</ClerkShell>;
}
