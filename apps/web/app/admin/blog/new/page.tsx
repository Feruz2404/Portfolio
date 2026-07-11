import BlogPostForm from "@/components/admin/blog/BlogPostForm";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function NewBlogPostPage() {
  await requireAdminPage("blog:write");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Blog Post</h1>
      <BlogPostForm mode="create" />
    </div>
  );
}
