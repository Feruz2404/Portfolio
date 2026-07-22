import { redirect } from "next/navigation";
import { auth } from "@/lib/server-auth";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminHeader from "@/components/admin/layout/AdminHeader";

// Authed area — always dynamic (reads the session cookie).
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/admin/login");
  if (!user.role) redirect("/admin/unauthorized");

  return (
    <div className="min-h-dvh bg-ink-950">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-0 md:grid-cols-[260px_1fr]">
        <AdminSidebar role={user.role} />
        <div className="min-w-0">
          <AdminHeader />
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
