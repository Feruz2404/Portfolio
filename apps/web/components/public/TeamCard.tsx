import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { SocialLinks, type SocialLink } from "@/components/public/SocialLinks";

export type TeamCardData = {
  slug: string;
  fullName: string;
  position: string;
  department?: string | null;
  avatar?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  telegramUrl?: string | null;
  portfolioUrl?: string | null;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamCard({
  member,
  socialLabel,
}: {
  member: TeamCardData;
  socialLabel: (name: string) => string;
}) {
  const socials = [
    member.githubUrl && { type: "github" as const, href: member.githubUrl },
    member.linkedinUrl && { type: "linkedin" as const, href: member.linkedinUrl },
    member.telegramUrl && { type: "telegram" as const, href: member.telegramUrl },
    member.portfolioUrl && { type: "portfolio" as const, href: member.portfolioUrl },
  ].filter(Boolean) as SocialLink[];

  return (
    <div className="group flex h-full min-w-0 flex-col rounded-lg border border-line bg-ink-850/60 p-6 transition-colors duration-300 hover:border-accent/30">
      <Link href={`/team/${member.slug}`} className="flex min-w-0 items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-ink-800">
          {member.avatar ? (
            <Image src={member.avatar} alt={member.fullName} fill sizes="64px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-display text-lg text-accent">
              {initials(member.fullName)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold tracking-tight text-bone group-hover:text-accent">
            {member.fullName}
          </h3>
          <p className="truncate text-sm text-bone-muted">{member.position}</p>
          {member.department ? (
            <p className="mt-0.5 truncate text-xs text-bone-faint">{member.department}</p>
          ) : null}
        </div>
      </Link>
      {socials.length ? <SocialLinks links={socials} labelFor={socialLabel} className="mt-5 flex gap-2" /> : null}
    </div>
  );
}
