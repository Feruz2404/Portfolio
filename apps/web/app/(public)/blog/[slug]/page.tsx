import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== "PUBLISHED") notFound();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <article className="mx-auto max-w-3xl py-16">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="prose prose-invert mt-8 max-w-none">
            <pre className="whitespace-pre-wrap text-sm">{post.content}</pre>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
