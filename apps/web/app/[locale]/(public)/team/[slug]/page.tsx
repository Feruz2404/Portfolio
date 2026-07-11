import { notFound } from "next/navigation";
import { databaseIsConfigured, prisma } from "@/lib/db";
import { publicProjectSelect, publicTeamSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!databaseIsConfigured) return notFound();
  const member = await prisma.teamMember.findFirst({ where: { slug, isActive: true }, select: { ...publicTeamSelect, projects: { where: { project: { status: { in: PUBLIC_PROJECT_STATUSES } } }, select: { id: true, role: true, project: { select: publicProjectSelect } } }, achievements: { select: { id: true, title: true, description: true, date: true } } } });
  if (!member) return notFound();
  return <main className="min-h-dvh bg-surface-00 px-6 py-16 sm:px-10 lg:px-12"><div className="mx-auto max-w-7xl"><div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow">People / profile</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] sm:text-7xl">{member.fullName}</h1><p className="mt-5 text-lg text-cyan-100/70">{member.position}</p></div><p className="max-w-2xl whitespace-pre-line text-lg leading-8 text-white/55">{member.bio ?? "A thoughtful collaborator who helps turn ambitious ideas into useful, durable work."}</p></div><div className="grid gap-12 py-16 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">Selected projects</p></div><div className="space-y-3">{member.projects.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div><div className="font-semibold text-white">{item.project.title}</div><div className="mt-1 text-sm text-white/40">{item.role}</div></div><span className="text-cyan-100">↗</span></div>)}{!member.projects.length ? <p className="text-sm text-white/40">No public projects yet.</p> : null}</div></div></div></main>;
}
