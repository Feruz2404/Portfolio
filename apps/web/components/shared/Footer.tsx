import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getContactSettings } from "@/lib/settings";

const EXPLORE = [
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/team", key: "team" },
  { href: "/services", key: "services" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

function GithubIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3v10ZM6.5 7.7a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5ZM19 19h-3v-5.3c0-1.3-.5-2.1-1.6-2.1-.9 0-1.4.6-1.6 1.2-.1.2-.1.5-.1.8V19h-3V9h3v1.4a3 3 0 0 1 2.7-1.5c2 0 3.2 1.3 3.2 4V19Z" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 3 2.6 10.5c-1.1.4-1.1 1-.2 1.3l5 1.6 1.9 5.9c.2.6.4.7 1 .3l2.8-2.1 4.8 3.6c.9.5 1.5.2 1.7-.8L23.7 4.4C24 3.2 23.2 2.6 22 3Zm-3.4 4.6-8.1 7.3-.3 3.4-1.7-5.2 10.1-6.4c.4-.3.8-.1.5.4Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export default async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const a11y = await getTranslations("a11y");
  const contact = await getContactSettings();
  const year = new Date().getFullYear();

  const socials = [
    contact.github && { href: contact.github, label: "GitHub", Icon: GithubIcon },
    contact.linkedin && { href: contact.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    contact.telegram && { href: contact.telegram, label: "Telegram", Icon: TelegramIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: () => React.JSX.Element }[];

  return (
    <footer className="relative mt-8 border-t border-line bg-ink-950">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        {/* Brand column */}
        <div className="max-w-sm">
          <Link href="/" className="font-display text-xl font-semibold tracking-tight text-bone">
            Feruz<span className="text-accent">.</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-bone-muted">{t("tagline")}</p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-bone-muted">
            <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
            {t("availability")}
          </div>
        </div>

        {/* Explore column */}
        <nav aria-label={a11y("footerNav")}>
          <h2 className="eyebrow">{t("exploreTitle")}</h2>
          <ul className="mt-5 flex flex-col gap-3">
            {EXPLORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-bone-muted transition-colors hover:text-bone">
                  {nav(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Connect + legal column */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="eyebrow">{t("connectTitle")}</h2>
            <div className="mt-5 flex flex-col gap-3">
              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 text-sm text-bone-muted transition-colors hover:text-bone"
                >
                  <MailIcon />
                  {contact.email}
                </a>
              ) : null}
              {socials.length > 0 ? (
                <div className="mt-1 flex items-center gap-2">
                  {socials.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={a11y("socialLabel", { name: label })}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-bone-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <h2 className="eyebrow">{t("legalTitle")}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <Link href="/privacy" className="text-sm text-bone-muted transition-colors hover:text-bone">
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-bone-muted transition-colors hover:text-bone">
                  {t("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-wide flex flex-col items-start justify-between gap-2 py-6 text-xs text-bone-faint sm:flex-row sm:items-center">
          <p>{t("copyright", { year })}</p>
          <p>{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
