import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/db";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
        </div>
        <Link href="/admin/blog/new" className="rounded-md bg-brand-violet px-3 py-2 text-sm font-semibold">
          New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-surface-01 text-left text-white/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/blog/${p.id}/edit` as Route} className="hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-white/70">{p.status}</td>
                <td className="px-4 py-3 text-white/60">{p.updatedAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
