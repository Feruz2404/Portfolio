import { redirect } from "next/navigation";
import { auth } from "@/lib/server-auth";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin/dashboard");

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-surface-01 p-6">
        <h1 className="text-xl font-semibold">Admin Login</h1>
        <p className="mt-1 text-sm text-white/60">Sign in to manage content and leads.</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
