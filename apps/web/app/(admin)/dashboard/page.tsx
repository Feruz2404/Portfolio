import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [projects, team, posts, contacts] = await Promise.all([
    prisma.project.count(),
    prisma.teamMember.count(),
    prisma.blogPost.count(),
    prisma.contact.count(),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card label="Projects" value={projects} />
      <Card label="Team Members" value={team} />
      <Card label="Blog Posts" value={posts} />
      <Card label="Leads" value={contacts} />
    </div>
  );
}

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
