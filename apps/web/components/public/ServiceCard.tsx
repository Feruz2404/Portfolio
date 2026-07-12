import { Link } from "@/lib/i18n/navigation";

export type ServiceCardData = {
  slug: string;
  title: string;
  description: string;
  icon?: string | null;
  features: string[];
};

export function ServiceCard({
  service,
  learnMoreLabel,
}: {
  service: ServiceCardData;
  learnMoreLabel: string;
}) {
  return (
    <div className="group flex h-full flex-col rounded-lg border border-line bg-ink-850/60 p-6 transition-colors duration-300 hover:border-accent/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-ink-800 text-xl">
        <span aria-hidden>{service.icon ?? "◆"}</span>
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-bone">{service.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-bone-muted">{service.description}</p>
      {service.features?.length ? (
        <ul className="mt-4 flex flex-col gap-1.5">
          {service.features.slice(0, 4).map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-bone-muted">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href="/services"
        className="mt-auto pt-5 text-sm font-medium text-accent"
        aria-label={`${learnMoreLabel}: ${service.title}`}
      >
        {learnMoreLabel} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
