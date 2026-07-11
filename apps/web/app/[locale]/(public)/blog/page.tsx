import { Link } from "@/lib/i18n/navigation";
import { prisma } from "@/lib/db";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }] });

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="rounded-xl border border-white/10 bg-surface-01 p-5 hover:border-white/20">
              <div className="text-lg font-semibold">{p.title}</div>
              {p.excerpt ? <p className="mt-2 text-sm text-white/60 line-clamp-2">{p.excerpt}</p> : null}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
