import { redirect } from "next/navigation";
import { auth } from "@/lib/server-auth";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    redirect("/admin/login");
  }

  const role = user.role;
  if (!role) {
    redirect("/admin/unauthorized");
  }

  return (
    <div className="min-h-dvh bg-surface-00">
      <div className="mx-auto grid max-w-[1400px] grid-cols-[260px_1fr] gap-0">
        <AdminSidebar role={role} />
        <div className="min-w-0">
          <AdminHeader />
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
