import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [projectsTotal, teamTotal, leadsTotal, postsTotal, pendingTestimonials] = await Promise.all([
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.contact.count(),
    prisma.blogPost.count(),
    prisma.testimonial.count({ where: { approved: false } })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-white/60">Overview of content, leads, and activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Projects" value={projectsTotal} />
        <MetricCard label="Team members" value={teamTotal} />
        <MetricCard label="Leads" value={leadsTotal} />
        <MetricCard label="Blog posts" value={postsTotal} />
        <MetricCard label="Testimonials pending" value={pendingTestimonials} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface-01 p-5">
      <div className="text-sm text-white/60">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
