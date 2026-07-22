import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage("blog:write");

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-normal">Edit Blog Post</h1>
      <BlogPostForm mode="edit" post={post} />
    </div>
  );
}
