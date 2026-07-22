import { auth } from "@/lib/server-auth";
import AdminShell from "@/components/admin/layout/AdminShell";
import type { AdminRole } from "@/components/admin/layout/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <AdminShell role={session?.user?.role as AdminRole | undefined} email={session?.user?.email}>
      {children}
    </AdminShell>
  );
}
