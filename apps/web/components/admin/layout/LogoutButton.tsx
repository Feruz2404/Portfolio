"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="rounded-md border border-line px-3 py-1.5 text-sm text-bone-muted transition-colors hover:border-line-strong hover:text-bone"
    >
      Sign out
    </button>
  );
}
