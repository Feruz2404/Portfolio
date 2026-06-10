import { prisma } from "@/lib/db";
import Link from "next/link";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <section className="mx-auto max-w-6xl py-16">
          <h1 className="text-4xl font-bold">Blog</h1>
          <div className="mt-8 grid gap-4">
            {posts.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="rounded-xl border border-border bg-card p-5 hover:bg-card/80">
                <div className="text-lg font-semibold">{p.title}</div>
                {p.excerpt ? <div className="mt-2 text-sm text-muted-foreground">{p.excerpt}</div> : null}
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
