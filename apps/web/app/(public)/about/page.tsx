'use client';

import { motion } from 'framer-motion';

// Tech stack items
const techStack = [
  { name: 'Next.js', icon: '▲' },
  { name: 'React', icon: '⚛' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Tailwind CSS', icon: '🎨' },
  { name: 'Prisma', icon: '◆' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'Node.js', icon: '⬡' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Git', icon: '⎇' },
  { name: 'Figma', icon: '🎭' },
  { name: 'REST API', icon: '🔌' },
  { name: 'GraphQL', icon: '◈' },
];

const values = [
  { title: 'Quality First', desc: 'We write clean, maintainable code that stands the test of time.' },
  { title: 'User Focused', desc: 'Every decision is made with the end user experience in mind.' },
  { title: 'Always Learning', desc: 'Technology evolves fast. We stay ahead of the curve.' },
  { title: 'Transparent', desc: 'Open communication and honest timelines, always.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-dvh">
      {/* Hero */}
      <section className="relative px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-transparent to-purple-950/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              We build{' '}
              <span className="gradient-text">digital products</span>{' '}
              people love
            </h1>
            <p className="mt-6 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              A passionate team of developers and designers creating exceptional web experiences for clients worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl"
          >
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-white/50 leading-relaxed">
              To deliver world-class digital solutions that empower businesses to grow, scale, and succeed in the modern digital landscape. We combine cutting-edge technology with thoughtful design.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-2xl"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-white/50 leading-relaxed">
              To become the most trusted technology partner for businesses across Central Asia and beyond, known for quality, reliability, and innovation that makes a real difference.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-6 py-24 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-center mb-16"
          >
            Tech Stack
          </motion.h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(99,102,241,0.5)' }}
                className="glass p-4 rounded-xl text-center group cursor-default transition-all duration-300"
              >
                <div className="text-2xl mb-2">{tech.icon}</div>
                <div className="text-xs text-white/60 group-hover:text-white transition-colors">{tech.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-center mb-16"
          >
            Our Values
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-8 h-0.5 bg-indigo-500 mb-4" />
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { number: '50+', label: 'Projects Delivered' },
                { number: '5+', label: 'Years Experience' },
                { number: '30+', label: 'Happy Clients' },
                { number: '3', label: 'Languages' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-4xl md:text-5xl font-black gradient-text">{stat.number}</div>
                  <div className="mt-2 text-sm text-white/40">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
