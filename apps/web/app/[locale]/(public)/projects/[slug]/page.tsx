import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { publicProjectSelect, publicTeamSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { slug, status: { in: PUBLIC_PROJECT_STATUSES } },
    select: {
      ...publicProjectSelect,
      teamMembers: { where: { member: { isActive: true } }, select: { id: true, role: true, member: { select: publicTeamSelect } } },
      testimonials: { where: { approved: true }, select: { id: true, name: true, position: true, company: true, avatar: true, content: true, rating: true, featured: true } },
      caseStudy: { where: { published: true }, select: { id: true, heroImage: true, overview: true, challenge: true, process: true, solution: true, outcome: true, metrics: true, timeline: true, published: true } }
    }
  });
  if (!project) return notFound();
  const vercelUrl = project.vercelUrl ?? project.liveUrl;

  return (
    <main className="min-h-dvh bg-surface-00 px-6 py-14 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-16 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
          <div>
            <p className="eyebrow">{project.category} / case study</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.08em] sm:text-7xl">{project.title}</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/58">{project.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {vercelUrl ? <ExternalLink href={vercelUrl} label="Open on Vercel" primary /> : null}
              {project.githubUrl ? <ExternalLink href={project.githubUrl} label="View GitHub" /> : null}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="Industry" value={project.industry ?? "Independent"} />
            <Info label="Status" value={project.status.replace("_", " ")} />
            <Info label="Stack" value={`${project.technologies.length} technologies`} />
            <Info label="Role" value="Product / engineering" />
          </div>
        </div>

        {project.screenshots.length ? (
          <div className="grid gap-4 py-12 sm:grid-cols-2">
            {project.screenshots.map((image, index) => <div key={image} className={`aspect-[16/10] rounded-3xl border border-white/10 bg-cover bg-center ${index === 0 ? "sm:col-span-2" : ""}`} style={{ backgroundImage: `linear-gradient(135deg, rgba(3,5,12,.1), rgba(3,5,12,.5)), url(${image})` }} />)}
          </div>
        ) : <div className="my-12 aspect-[2.2/1] rounded-[2rem] border border-cyan-200/15 bg-[radial-gradient(circle_at_25%_30%,rgba(255,77,157,.28),transparent_22%),radial-gradient(circle_at_70%_30%,rgba(92,225,230,.24),transparent_25%),linear-gradient(135deg,#12162a,#05060d)]" />}

        <div className="grid gap-12 pb-20 lg:grid-cols-[1.1fr_.9fr]">
          <div className="space-y-10">
            <Story title="The brief" body={project.challenge} fallback="A focused digital experience that needed to feel clear at first glance and rewarding after a closer look." />
            <Story title="The approach" body={project.solution} fallback="A small, expressive system: strong type, intentional motion, and reusable components that keep the experience coherent." />
            <Story title="The outcome" body={project.results} fallback="A portfolio-ready product surface that makes the work easy to understand and the next step easy to take." />
          </div>
          <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.035] p-6 lg:sticky lg:top-24">
            <p className="eyebrow">Technology</p>
            <div className="mt-5 flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="rounded-full border border-cyan-100/15 bg-cyan-100/[0.04] px-3 py-2 font-mono text-xs text-cyan-100/75">{technology}</span>)}</div>
            {project.architecture ? <div className="mt-9 border-t border-white/10 pt-6"><p className="eyebrow">Architecture</p><p className="mt-4 whitespace-pre-line text-sm leading-6 text-white/55">{project.architecture}</p></div> : null}
            {project.teamMembers.length ? <div className="mt-9 border-t border-white/10 pt-6"><p className="eyebrow">People</p><div className="mt-4 space-y-3">{project.teamMembers.map((tm) => <div key={tm.id} className="flex items-center justify-between gap-4 text-sm"><span className="text-white/80">{tm.member.fullName}</span><span className="text-white/40">{tm.role}</span></div>)}</div></div> : null}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"><p className="eyebrow">{label}</p><p className="mt-3 text-sm text-white/80">{value}</p></div>;
}

function Story({ title, body, fallback }: { title: string; body: string | null; fallback: string }) {
  return <section><p className="eyebrow">{title}</p><p className="mt-4 whitespace-pre-line text-lg leading-8 text-white/65">{body || fallback}</p></section>;
}

function ExternalLink({ href, label, primary = false }: { href: string; label: string; primary?: boolean }) {
  return <a href={href} target="_blank" rel="noreferrer" className={`rounded-full px-5 py-3 text-sm font-semibold transition ${primary ? "bg-cyan-100 text-surface-00 hover:bg-white" : "border border-white/15 text-white/75 hover:border-white/40 hover:text-white"}`}>{label} ↗</a>;
}
