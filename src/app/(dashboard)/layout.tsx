import { getCurrentUser } from "@/lib/actions/auth";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
