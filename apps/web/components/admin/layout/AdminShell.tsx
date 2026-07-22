"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import AdminHeader from "@/components/admin/layout/AdminHeader";
import AdminSidebar, { type AdminRole } from "@/components/admin/layout/AdminSidebar";

export default function AdminShell({
  children,
  role,
  email,
}: {
  children: React.ReactNode;
  role?: AdminRole;
  email?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isAuthSurface = pathname === "/admin/login" || pathname === "/admin/unauthorized";

  if (isAuthSurface) {
    return <div className="min-h-dvh bg-surface-00">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-surface-00 text-white">
      <div className="mx-auto grid max-w-[1480px] grid-cols-1 lg:grid-cols-[280px_1fr]">
        <AdminSidebar role={role} open={open} onClose={() => setOpen(false)} />
        {open ? (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-black/70 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}
        <div className="min-w-0">
          <AdminHeader email={email} onMenu={() => setOpen(true)} />
          <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
