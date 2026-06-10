import BlogPostForm from "@/components/admin/blog/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Blog Post</h1>
      <BlogPostForm mode="create" />
    </div>
  );
}
