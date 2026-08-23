import { ClerkShell } from "@/components/auth/clerk-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClerkShell>{children}</ClerkShell>;
}
