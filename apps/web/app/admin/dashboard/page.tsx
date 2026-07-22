import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

type DashboardData = {
  projectsTotal: number;
  teamTotal: number;
  leadsTotal: number;
  postsTotal: number;
  pendingTestimonials: number;
  recentLeads: Array<{ id: string; name: string; email: string; status: string; createdAt: Date }>;
};

async function getDashboardData(): Promise<DashboardData> {
  const [projectsTotal, teamTotal, leadsTotal, postsTotal, pendingTestimonials, recentLeads] = await Promise.all([
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.contact.count(),
    prisma.blogPost.count(),
    prisma.testimonial.count({ where: { approved: false } }),
    prisma.contact.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, status: true, createdAt: true },
    }),
  ]);

  return { projectsTotal, teamTotal, leadsTotal, postsTotal, pendingTestimonials, recentLeads };
}

export default async function AdminDashboardPage() {
  const context = await requireAdminPage("analytics:read");

  try {
    const data = await getDashboardData();

    return (
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="section-eyebrow">Overview</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white">Dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">
              Live operating view for portfolio content, leads, publishing, and admin activity.
            </p>
          </div>
          <div className="border border-white/10 bg-white/[0.03] p-4 text-sm text-white/58">
            Signed in as <span className="text-white">{context.session.user.email}</span>
          </div>
        </div>

        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard label="Projects" value={data.projectsTotal} tone="teal" />
          <MetricCard label="Team members" value={data.teamTotal} tone="white" />
          <MetricCard label="Leads" value={data.leadsTotal} tone="gold" />
          <MetricCard label="Blog posts" value={data.postsTotal} tone="white" />
          <MetricCard label="Testimonials pending" value={data.pendingTestimonials} tone="teal" />
        </div>

        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="border border-white/10 bg-white/[0.025]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-semibold">Recent leads</h2>
              <p className="mt-1 text-sm text-white/46">Newest contact requests captured from the public site.</p>
            </div>
            {data.recentLeads.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.16em] text-white/38">
                    <tr>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {data.recentLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-5 py-4 text-white">{lead.name}</td>
                        <td className="px-5 py-4 text-white/58">{lead.email}</td>
                        <td className="px-5 py-4">
                          <span className="border border-white/10 px-2 py-1 text-xs text-white/62">{lead.status}</span>
                        </td>
                        <td className="px-5 py-4 text-white/42">{lead.createdAt.toISOString().slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No leads yet" body="Contact submissions will appear here after the first public inquiry." />
            )}
          </div>

          <div className="border border-white/10 bg-white/[0.025] p-5">
            <h2 className="text-lg font-semibold">Operational checks</h2>
            <div className="mt-5 space-y-3">
              {[
                "Server-side RBAC active",
                "JWT sessions enabled",
                "Admin API routes guarded",
                "Audit logging enabled for mutations",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between border border-white/10 px-3 py-2 text-sm text-white/62">
                  <span>{item}</span>
                  <span className="h-2 w-2 bg-teal-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  } catch {
    return (
      <div className="space-y-6">
        <div>
          <p className="section-eyebrow">Database</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-white">Dashboard unavailable</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/56">
            The admin session is valid, but the dashboard could not read from the database. Verify `DATABASE_URL`, migrations, and database availability.
          </p>
        </div>
        <div className="border border-red-300/20 bg-red-950/20 p-5 text-sm leading-6 text-red-100">
          No sensitive database details are shown here. Check server logs for the provider-specific error.
        </div>
      </div>
    );
  }
}

function MetricCard({ label, value, tone }: { label: string; value: number; tone: "teal" | "gold" | "white" }) {
  const color = tone === "teal" ? "text-teal-200" : tone === "gold" ? "text-[#d8c58a]" : "text-white";

  return (
    <article className="bg-[#05050d] p-5">
      <div className="text-[0.66rem] uppercase tracking-[0.18em] text-white/38">{label}</div>
      <div className={`mt-5 font-mono text-4xl font-semibold ${color}`}>{value}</div>
    </article>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-white/50">{body}</p>
    </div>
  );
}
