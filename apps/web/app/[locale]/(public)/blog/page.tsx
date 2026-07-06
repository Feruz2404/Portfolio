import { Link } from "@/lib/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";

export default async function BlogPage() {
  if (!getEnv().DATABASE_URL) return <main className="min-h-screen px-6 py-24 text-center"><h1 className="text-3xl font-black">No posts yet</h1></main>;

  const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ publishedAt: "desc" as const }, { createdAt: "desc" as const }] });

  if (!posts.length) return <main className="min-h-screen px-6 py-24 text-center"><h1 className="text-3xl font-black">No posts yet</h1></main>;

  const [featured, ...rest] = posts;

  return (
    <main className="min-h-screen px-6 py-24">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">Our <span className="gradient-text">Blog</span></h1>
        <p className="mt-4 text-white/50 max-w-lg mx-auto">Insights, tutorials, and thoughts on building modern digital products.</p>
      </div>

      {/* Featured post */}
      {featured && (
        <Link href={`/blog/${featured.slug}`} className="block glass rounded-2xl overflow-hidden mb-12 group hover:border-indigo-500/30 transition-colors">
          <div className="grid md:grid-cols-2 gap-0">
            {featured.coverImage && (
              <div className="relative aspect-video h-full md:aspect-auto">
                <Image src={featured.coverImage} alt={featured.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {featured.publishedAt && (
                <span className="text-xs text-indigo-400 font-medium">{featured.publishedAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              )}
              <h2 className="mt-3 text-2xl md:text-3xl font-bold leading-tight group-hover:text-indigo-300 transition-colors">{featured.title}</h2>
              {featured.excerpt && <p className="mt-4 text-sm text-white/50 line-clamp-3 leading-relaxed">{featured.excerpt}</p>}
              <span className="mt-6 inline-flex items-center text-sm font-medium text-indigo-400">Read article <span className="ml-1 group-hover:translate-x-1 transition-transform inline-block">→</span></span>
            </div>
          </div>
        </Link>
      )}

      {/* Rest of posts */}
      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group glass rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
              {post.coverImage && (
                <div className="relative aspect-video">
                  <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              )}
              <div className="p-5">
                {post.publishedAt && (
                  <span className="text-[10px] text-indigo-400 font-medium">{post.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                )}
                <h3 className="mt-2 text-lg font-bold line-clamp-2 group-hover:text-indigo-300 transition-colors">{post.title}</h3>
                {post.excerpt && <p className="mt-2 text-xs text-white/40 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                {post.readingTime && (
                  <span className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40">
                    {post.readingTime} min read
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
