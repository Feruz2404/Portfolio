"use client";

import { signIn } from "next-auth/react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const form = new FormData(e.currentTarget);
        const email = String(form.get("email") || "").trim();
        const password = String(form.get("password") || "");

        try {
          const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/admin/dashboard",
          });

          if (!res || res.error) {
            setError("The email or password is incorrect.");
            return;
          }

          router.replace("/admin/dashboard" as Route);
          router.refresh();
        } catch {
          setError("Unable to sign in right now. Check the admin environment and database connection.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="space-y-2">
        <label htmlFor="admin-email" className="text-sm text-white/70">Email</label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full border border-white/10 bg-surface-00 px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-200/50"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="admin-password" className="text-sm text-white/70">Password</label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
          className="w-full border border-white/10 bg-surface-00 px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal-200/50"
        />
      </div>
      {error ? <p className="border border-red-300/20 bg-red-950/30 px-3 py-2 text-sm text-red-200">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white px-3 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
