import type { Route } from "next";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 py-16">
      <div className="w-full max-w-xl border border-white/10 bg-[#05050d] p-8">
        <p className="section-eyebrow">Access blocked</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-normal">Unauthorized</h1>
        <p className="mt-3 text-sm leading-6 text-white/62">Your account is signed in, but it does not have permission to open this admin area.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={"/admin/dashboard" as Route} className="bg-white px-4 py-2 text-sm font-semibold text-black">
            Back to dashboard
          </Link>
          <Link href={"/" as Route} className="border border-white/10 px-4 py-2 text-sm font-semibold text-white/72">
            View public site
          </Link>
        </div>
      </div>
    </main>
  );
}
