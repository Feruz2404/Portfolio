// Server Component – framer-motion is NOT allowed here.
// Animations removed; use CSS transitions instead.
import Link from "next/link";

async function FeaturedProjects() {
  const { prisma } = await import("@/lib/db");
  const projects = await prisma.project.findMany({
    where: { featured: true },
    take: 4,
    select: { id: true, title: true, slug: true, description: true, category: true, technologies: true, screenshots: true }
  });

  return (
    <section className="py-24 px-6">
      <h2 className="text-center text-3xl md:text-4xl font-black tracking-tight mb-16">Featured Projects</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {projects.map((p) => (
          <div key={p.id} className="group glass rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-300">
            <div className="aspect-video overflow-hidden">
              {p.screenshots?.[0] ? (
                <img src={p.screenshots[0]} alt={p.title ?? "Project"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
              )}
            </div>
            <div className="p-5">
              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold">{p.category}</span>
              <h3 className="mt-2 text-lg font-bold truncate">{p.title}</h3>
              <p className="mt-1 text-xs text-white/50 line-clamp-2 leading-relaxed">{p.description}</p>
              {p.technologies?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.technologies.slice(0, 4).map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60">{t}</span>
                  ))}
                </div>
              )}
              <Link href={`/projects/${p.slug}` as any} className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                View Project <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function ServicesSection() {
  const { prisma } = await import("@/lib/db");
  const services = await prisma.service.findMany({ where: { isActive: true }, take: 6, orderBy: { order: "asc" } });
  if (!services.length) return null;

  const iconEmojis = ["💻", "📱", "🎨", "☁️", "🗄️", "💡"];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
      <h2 className="text-center text-3xl md:text-4xl font-black tracking-tight mb-16">What We Do</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {services.map((s, i) => (
          <div key={s.id} className="glass p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300">
            <span className="text-3xl">{iconEmojis[i % iconEmojis.length]}</span>
            <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/50 line-clamp-3 leading-relaxed">{s.description}</p>
            <Link href="/services" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
              Learn more <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

async function TeamPreview() {
  const { prisma } = await import("@/lib/db");
  const team = await prisma.teamMember.findMany({
    where: { isActive: true },
    take: 3,
    select: { id: true, fullName: true, slug: true, position: true, avatar: true, githubUrl: true, linkedinUrl: true, telegramUrl: true }
  });
  if (!team.length) return null;

  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <section className="py-24 px-6">
      <h2 className="text-center text-3xl md:text-4xl font-black tracking-tight mb-16">The Team</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {team.map((m) => (
          <div key={m.id} className="glass p-6 rounded-2xl text-center hover:-translate-y-1 transition-all duration-300 group">
            <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all">
              {m.avatar ? (
                <img src={m.avatar} alt={m.fullName ?? "Team member"} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">{initials(m.fullName)}</div>
              )}
            </div>
            <h3 className="font-bold">{m.fullName}</h3>
            <p className="text-indigo-400 text-sm mt-1">{m.position}</p>
            <div className="mt-4 flex justify-center gap-3">
              {m.githubUrl && (
                <a href={m.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              )}
              {m.linkedinUrl && (
                <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.073-.925-2.073-2.073s.925-2.073 2.073-2.073 2.073.925 2.073 2.073-.925 2.073-2.073 2.073zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {m.telegramUrl && (
                <a href={m.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

async function TestimonialsSection() {
  const { prisma } = await import("@/lib/db");
  const testimonials = await prisma.testimonial.findMany({
    where: { approved: true },
    take: 3,
    select: { id: true, name: true, position: true, company: true, content: true }
  });
  if (!testimonials.length) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="glass p-6 rounded-2xl">
            <span className="text-6xl leading-none gradient-text">&ldquo;</span>
            <p className="mt-4 text-sm text-white/70 italic leading-relaxed">{t.content}</p>
            <div className="mt-6 pt-4 border-t border-white/10">
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-white/40 mt-1">{t.position} @ {t.company}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ServerContent() {
  return (
    <>
      <FeaturedProjects />
      <ServicesSection />
      <TeamPreview />
      <TestimonialsSection />
    </>
  );
}
