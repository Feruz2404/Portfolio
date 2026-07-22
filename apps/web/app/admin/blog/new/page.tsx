import { requireAdminPage } from "@/lib/adminAuth";
import BlogPostForm from "@/components/admin/blog/BlogPostForm";

export default async function NewBlogPostPage() {
  await requireAdminPage("blog:write");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-normal">New Blog Post</h1>
      <BlogPostForm mode="create" />
    </div>
  );
}
