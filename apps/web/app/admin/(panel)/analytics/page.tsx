import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminAnalyticsPage() {
  await requireAdminPage("analytics:read");

  const [pageViews, leads] = await Promise.all([prisma.pageView.count(), prisma.contact.count()]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-surface-01 p-5">
          <div className="text-sm text-white/60">Total page views</div>
          <div className="mt-2 text-3xl font-semibold">{pageViews}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-surface-01 p-5">
          <div className="text-sm text-white/60">Total leads</div>
          <div className="mt-2 text-3xl font-semibold">{leads}</div>
        </div>
      </div>
    </div>
  );
}
