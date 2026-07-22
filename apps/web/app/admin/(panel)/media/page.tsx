import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminMediaPage() {
  await requireAdminPage("media:write");

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Media</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((m) => (
          <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-surface-01 p-5 hover:border-white/20">
            <div className="text-sm font-semibold truncate">{m.filename}</div>
            <div className="mt-1 text-xs text-white/50">{m.mimeType}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
