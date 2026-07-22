import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleCard } from "@/components/public/ArticleCard";
import { getPublishedPosts } from "@/lib/content";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return buildMetadata({ locale, path: "/blog", title: t("title"), description: t("intro") });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const posts = await getPublishedPosts(locale);

  return (
    <>
      <Section width="wide" className="pt-16 md:pt-24">
        <Reveal className="max-w-3xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-bone md:text-7xl">{t("title")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">{t("intro")}</p>
        </Reveal>
      </Section>

      <Section width="wide" className="border-t border-line pt-12">
        {posts.length === 0 ? (
          <p className="rounded-lg border border-line bg-ink-850/40 p-10 text-center text-bone-muted">{t("empty")}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.05}>
                <ArticleCard
                  post={post}
                  locale={locale}
                  readingTimeLabel={post.readingTime ? t("readingTime", { minutes: post.readingTime }) : undefined}
                />
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
