import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") return notFound();

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        {post.excerpt ? <p className="mt-3 text-white/60">{post.excerpt}</p> : null}
        <article className="prose prose-invert mt-10 max-w-none">
          <pre className="whitespace-pre-wrap">{post.content}</pre>
        </article>
      </div>
    </main>
  );
}
