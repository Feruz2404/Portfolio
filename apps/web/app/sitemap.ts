import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // FIX: prefer NEXT_PUBLIC_SITE_URL; NEXTAUTH_URL is an auth-specific var
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`,           lastModified: new Date() },
    { url: `${baseUrl}/about`,      lastModified: new Date() },
    { url: `${baseUrl}/projects`,   lastModified: new Date() },
    { url: `${baseUrl}/team`,       lastModified: new Date() },
    { url: `${baseUrl}/services`,   lastModified: new Date() },
    { url: `${baseUrl}/case-studies`, lastModified: new Date() },
    { url: `${baseUrl}/testimonials`, lastModified: new Date() },
    { url: `${baseUrl}/blog`,       lastModified: new Date() },
    { url: `${baseUrl}/career`,     lastModified: new Date() },
    { url: `${baseUrl}/contact`,    lastModified: new Date() },
    { url: `${baseUrl}/media-kit`,  lastModified: new Date() },
    { url: `${baseUrl}/privacy`,    lastModified: new Date() },
    { url: `${baseUrl}/terms`,      lastModified: new Date() },
  ];

  if (!process.env.DATABASE_URL) return staticRoutes;

  const [projects, posts, members] = await Promise.all([
    prisma.project.findMany({ where: { status: "COMPLETED" }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED"  }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.teamMember.findMany({ where: { isActive: true },    select: { slug: true, updatedAt: true } }).catch(() => []),
  ]);

  return [
    ...staticRoutes,
    ...projects.map((p) => ({ url: `${baseUrl}/projects/${p.slug}`,   lastModified: p.updatedAt })),
    ...posts.map((p)    => ({ url: `${baseUrl}/blog/${p.slug}`,       lastModified: p.updatedAt })),
    ...members.map((m)  => ({ url: `${baseUrl}/team/${m.slug}`,       lastModified: m.updatedAt })),
  ];
}
