import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
  readingTime?: number | null;
};

export function ArticleCard({
  post,
  locale,
  readingTimeLabel,
}: {
  post: ArticleCardData;
  locale: string;
  readingTimeLabel?: string;
}) {
  const date = post.publishedAt
    ? new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(
        new Date(post.publishedAt),
      )
    : null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-ink-850/60 transition-colors duration-300 hover:border-accent/30"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-ink-800">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="atelier-grid absolute inset-0 opacity-60" aria-hidden />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-xs text-bone-faint">
          {date ? <span>{date}</span> : null}
          {date && readingTimeLabel ? <span aria-hidden>·</span> : null}
          {readingTimeLabel ? <span>{readingTimeLabel}</span> : null}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-bone group-hover:text-accent">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone-muted">{post.excerpt}</p>
        ) : null}
      </div>
    </Link>
  );
}
