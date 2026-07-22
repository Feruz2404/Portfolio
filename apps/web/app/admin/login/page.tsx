import { redirect } from "next/navigation";
import { auth } from "@/lib/server-auth";
import LoginForm from "@/components/auth/LoginForm";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user) redirect("/admin/dashboard");

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(125,243,226,0.13),transparent_30%),linear-gradient(180deg,#020208,#05050d)]" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:96px_96px]" />

      <section className="relative z-10 w-full max-w-md border border-white/10 bg-[#05050d]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur">
        <div className="mb-7">
          <p className="section-eyebrow">Secure access</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-normal text-white">Admin control room</h1>
          <p className="mt-3 text-sm leading-6 text-white/54">Sign in with an authorized account to manage content, leads, media, and operations.</p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
