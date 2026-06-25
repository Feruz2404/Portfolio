import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") return notFound();

  return (
    <main className="min-h-dvh px-6 py-16">
      <article className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-10">
          {post.publishedAt && (
            <time className="text-xs text-indigo-400 font-medium">
              {post.publishedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          )}
          <h1 className="mt-3 text-3xl font-semibold tracking-tight leading-tight">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-4 text-lg text-white/60 leading-relaxed">{post.excerpt}</p>
          )}
          {post.readingTime && (
            <p className="mt-3 text-xs text-white/40">{post.readingTime} min read</p>
          )}
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="mb-10 overflow-hidden rounded-xl">
            <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
          </div>
        )}

        {/* Content – rendered as plain text until MDX is wired up */}
        <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
          {post.content}
        </div>
      </article>
    </main>
  );
}
