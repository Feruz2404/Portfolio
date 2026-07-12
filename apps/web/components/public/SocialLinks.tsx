const ICONS: Record<string, React.JSX.Element> = {
  github: (
    <path d="M12 .5C5.7.5.5 5.7.5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.8 18.3 5.1 18.3 5.1c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.7 18.3.5 12 .5Z" />
  ),
  linkedin: (
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V9h3v10ZM6.5 7.7a1.8 1.8 0 1 1 0-3.5 1.8 1.8 0 0 1 0 3.5ZM19 19h-3v-5.3c0-1.3-.5-2.1-1.6-2.1-.9 0-1.4.6-1.6 1.2-.1.2-.1.5-.1.8V19h-3V9h3v1.4a3 3 0 0 1 2.7-1.5c2 0 3.2 1.3 3.2 4V19Z" />
  ),
  telegram: (
    <path d="M22 3 2.6 10.5c-1.1.4-1.1 1-.2 1.3l5 1.6 1.9 5.9c.2.6.4.7 1 .3l2.8-2.1 4.8 3.6c.9.5 1.5.2 1.7-.8L23.7 4.4C24 3.2 23.2 2.6 22 3Zm-3.4 4.6-8.1 7.3-.3 3.4-1.7-5.2 10.1-6.4c.4-.3.8-.1.5.4Z" />
  ),
  portfolio: (
    <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  ),
};

export type SocialLink = { type: keyof typeof ICONS; href: string };

export function SocialLinks({
  links,
  labelFor,
  className,
}: {
  links: SocialLink[];
  labelFor: (name: string) => string;
  className?: string;
}) {
  if (!links.length) return null;
  return (
    <div className={className ?? "flex items-center gap-2"}>
      {links.map(({ type, href }) => (
        <a
          key={type}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={labelFor(type[0].toUpperCase() + type.slice(1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-bone-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {ICONS[type]}
          </svg>
        </a>
      ))}
    </div>
  );
}
