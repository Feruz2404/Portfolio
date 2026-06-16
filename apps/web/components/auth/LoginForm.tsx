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

        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/admin/dashboard"
        });

        if (res?.error) {
          setError("Invalid credentials");
        } else {
          router.push("/admin/dashboard" as Route);
          router.refresh();
        }
        setLoading(false);
      }}
    >
      <div className="space-y-2">
        <label className="text-sm text-white/70">Email</label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-white/70">Password</label>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-violet px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
