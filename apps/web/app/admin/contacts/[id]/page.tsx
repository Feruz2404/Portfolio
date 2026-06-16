import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function AdminContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await prisma.contact.findUnique({ where: { id }, include: { notes: true, emailHistory: true } });
  if (!contact) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{contact.name}</h1>
        <p className="mt-1 text-sm text-white/60">{contact.email}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-surface-01 p-6">
        <div className="text-sm text-white/60">Message</div>
        <div className="mt-2 whitespace-pre-wrap text-white/80">{contact.message}</div>
      </div>
    </div>
  );
}
