import { notFound } from "next/navigation";
import { databaseIsConfigured, prisma } from "@/lib/db";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!databaseIsConfigured) return notFound();
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") return notFound();
  return <main className="min-h-dvh bg-surface-00 px-6 py-16 sm:px-10 lg:px-12"><article className="mx-auto max-w-3xl"><p className="eyebrow">Notes / {post.readingTime ? `${post.readingTime} min read` : "field note"}</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] sm:text-7xl">{post.title}</h1>{post.excerpt ? <p className="mt-7 text-xl leading-8 text-white/55">{post.excerpt}</p> : null}<div className="mt-14 whitespace-pre-line border-t border-white/10 pt-10 text-lg leading-9 text-white/70">{post.content}</div></article></main>;
}
