"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { fadeInUp, staggerContainer } from "@/components/animations/variants";
import Link from "next/link";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { ssr: false });

const stats = [
  { number: "50+", label: "Projects Delivered" },
  { number: "5+", label: "Years Experience" },
  { number: "3", label: "Languages Spoken" },
];

const servicesTicker = [
  "WEB DEVELOPMENT",
  "MOBILE APPS",
  "UI/UX DESIGN",
  "DATABASE ARCHITECTURE",
  "API DEVELOPMENT",
  "CLOUD INFRASTRUCTURE",
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-purple-950/20 to-cyan-950/30" />
        <motion.div
          className="relative z-10 flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
            </span>
            <span className="text-sm text-indigo-300 font-medium tracking-wide">Available for projects</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight">
            <span className="block text-white">Building</span>
            <span className="gradient-text block">Digital</span>
            <span className="block text-white">Experiences</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 text-base md:text-lg text-white/60 max-w-md leading-relaxed">
            We craft high-performance web applications, immersive digital products, and scalable systems that drive real business growth.
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-black gradient-text">{s.number}</div>
                <div className="text-xs text-white/40 mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
            <Link href="/projects" className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-colors text-sm tracking-wide">
              View Projects
            </Link>
            <Link href="/contact" className="inline-flex items-center px-6 py-3 border border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-colors text-sm tracking-wide">
              Contact Us
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:left-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-[10px] text-white/30 tracking-widest uppercase">Scroll</span>
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative h-[50vh] lg:h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[120%] aspect-square rounded-full bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-cyan-600/10 blur-3xl" />
          </div>
          <div className="absolute inset-0">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <section className="border-y border-white/10 bg-black/50 overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-marquee gap-8 px-4">
          {[...servicesTicker, ...servicesTicker].map((item, i) => (
            <span key={i} className="text-sm font-bold tracking-widest text-white/20 flex items-center gap-3">
              {item}
              <span className="text-indigo-500 text-xs">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <FeaturedProjects />

      {/* ── Services ── */}
      <ServicesSection />

      {/* ── Team Preview ── */}
      <TeamPreview />

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── CTA ── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-purple-950/20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Ready to build something amazing?</h2>
          <p className="mt-4 text-white/50">Share your idea and let&apos;s turn it into a product people love.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <input type="email" placeholder="Enter your email" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 w-72" />
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-colors text-sm">
              Get in Touch
            </Link>
          </div>
          <p className="mt-4 text-[11px] text-white/25">No spam. We reply within 24 hours.</p>
        </motion.div>
      </section>

      {/* Custom CSS for marquee */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </main>
  );
}

async function FeaturedProjects() {
  const { prisma } = await import("@/lib/db");
  const projects = await prisma.project.findMany({ where: { featured: true }, take: 4, select: { id: true, title: true, slug: true, description: true, category: true, technologies: true, screenshots: true } });

  return (
    <section className="py-24 px-6">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-3xl md:text-4xl font-black tracking-tight mb-16">Featured Projects</motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {projects.map((p, i) => (
          <motion.div key={p.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group glass rounded-2xl overflow-hidden hover:scale-[1.03] transition-transform duration-300">
            <div className="aspect-video overflow-hidden">
              {p.screenshots?.[0] ? (
                <img src={p.screenshots[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
          </motion.div>
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
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-3xl md:text-4xl font-black tracking-tight mb-16">What We Do</motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {services.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass p-6 rounded-2xl group hover:-translate-y-1 transition-all duration-300">
            <span className="text-3xl">{iconEmojis[i % iconEmojis.length]}</span>
            <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-white/50 line-clamp-3 leading-relaxed">{s.description}</p>
            <Link href="/services" className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
              Learn more <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

async function TeamPreview() {
  const { prisma } = await import("@/lib/db");
  const team = await prisma.teamMember.findMany({ where: { isActive: true }, take: 3, select: { id: true, fullName: true, slug: true, position: true, avatar: true, githubUrl: true, linkedinUrl: true, telegramUrl: true } });
  if (!team.length) return null;

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <section className="py-24 px-6">
      <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center text-3xl md:text-4xl font-black tracking-tight mb-16">The Team</motion.h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {team.map((m, i) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass p-6 rounded-2xl text-center hover:-translate-y-1 transition-all duration-300 group">
            <div className="mx-auto w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all">
              {m.avatar ? (
                <img src={m.avatar} alt={m.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">{initials(m.fullName)}</div>
              )}
            </div>
            <h3 className="font-bold">{m.fullName}</h3>
            <p className="text-indigo-400 text-sm mt-1">{m.position}</p>
            <div className="mt-4 flex justify-center gap-3">
              {m.githubUrl && <a href={m.githubUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>}
              {m.linkedinUrl && <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.073-.925-2.073-2.073s.925-2.073 2.073-2.073 2.073.925 2.073 2.073-.925 2.073-2.073 2.073zm17.219 13.019h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg></a>}
              {m.telegramUrl && <a href={m.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg></a>}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

async function TestimonialsSection() {
  const { prisma } = await import("@/lib/db");
  const testimonials = await prisma.testimonial.findMany({ where: { approved: true }, take: 3, select: { id: true, name: true, position: true, company: true, content: true } });
  if (!testimonials.length) return null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass p-6 rounded-2xl">
            <span className="text-6xl leading-none gradient-text">&ldquo;</span>
            <p className="mt-4 text-sm text-white/70 italic leading-relaxed">{t.content}</p>
            <div className="mt-6 pt-4 border-t border-white/8">
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-white/40 mt-1">{t.position} @ {t.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
