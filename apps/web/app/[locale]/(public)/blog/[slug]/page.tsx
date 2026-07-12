import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import { Section, Container } from "@/components/ui/layout";
import { Tag } from "@/components/ui/Tag";
import { JsonLd } from "@/components/seo/JsonLd";
import { sanitizeRichText } from "@/lib/sanitize";
import { getPostBySlug, getPostSlugs, getPublishedPosts } from "@/lib/content";

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(locale, slug);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: (post.excerpt ?? "").slice(0, 200),
    images: post.coverImage ? [post.coverImage] : undefined,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPostBySlug(locale, slug);
  if (!post) notFound();

  const t = await getTranslations("blog");
  const clean = sanitizeRichText(post.content);
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(post.publishedAt))
    : null;

  const related = (await getPublishedPosts(locale, 4)).filter((p) => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.coverImage ? { image: post.coverImage } : {}),
    ...(post.publishedAt ? { datePublished: new Date(post.publishedAt).toISOString() } : {}),
    ...(post.author?.name ? { author: { "@type": "Person", name: post.author.name } } : {}),
    url: absoluteUrl(localizedPath(locale, `/blog/${slug}`)),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section width="content" className="pt-12 md:pt-16">
        <article className="mx-auto max-w-prose">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-bone-muted transition-colors hover:text-accent">
            <span aria-hidden>←</span> {t("backToBlog")}
          </Link>

          <header className="mt-8">
            <div className="flex flex-wrap items-center gap-2 text-sm text-bone-faint">
              {date ? <time dateTime={new Date(post.publishedAt!).toISOString()}>{date}</time> : null}
              {date && post.readingTime ? <span aria-hidden>·</span> : null}
              {post.readingTime ? <span>{t("readingTime", { minutes: post.readingTime })}</span> : null}
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-bone md:text-5xl">{post.title}</h1>
            {post.author?.name ? <p className="mt-4 text-sm text-bone-muted">{t("by", { author: post.author.name })}</p> : null}
          </header>
        </article>
      </Section>

      {post.coverImage ? (
        <Container width="content" className="mt-2 max-w-3xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line bg-ink-800">
            <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
          </div>
        </Container>
      ) : null}

      <Section width="content" className="pt-10">
        <div
          className="prose-atelier mx-auto max-w-prose"
          // Content is sanitized server-side via sanitizeRichText (allowlist).
          dangerouslySetInnerHTML={{ __html: clean }}
        />
      </Section>

      {related.length ? (
        <Section width="wide" className="border-t border-line">
          <h2 className="eyebrow">{t("related")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group rounded-lg border border-line bg-ink-850/50 p-5 transition-colors hover:border-accent/30"
              >
                {p.readingTime ? <Tag tone="muted">{t("readingTime", { minutes: p.readingTime })}</Tag> : null}
                <h3 className="mt-3 font-semibold leading-snug tracking-tight text-bone group-hover:text-accent">{p.title}</h3>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
