export default function AboutPage() {
  return (
    <main className="min-h-dvh bg-surface-00 px-6 py-16 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-20 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><p className="eyebrow">About / the short version</p><h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.08em] sm:text-7xl">I turn complex ideas into digital experiences people want to spend time with.</h1></div><p className="max-w-md text-base leading-7 text-white/55">A product-minded engineer with a soft spot for great typography, useful motion, and the moment a rough idea starts to feel inevitable.</p></div>
        <div className="grid gap-16 py-20 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">The point of view</p></div><div className="space-y-7 text-lg leading-8 text-white/65"><p>I work at the intersection of product thinking, visual design, and full-stack engineering. That means asking the uncomfortable questions early, keeping the system simple, and making room for one or two details nobody expected.</p><p>My best work is collaborative: a small, focused team, an honest brief, and enough trust to explore before we commit.</p><div className="grid gap-3 pt-6 sm:grid-cols-3"><Badge label="Product thinking" /><Badge label="Creative code" /><Badge label="Systems that last" /></div></div></div>
        <div className="grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-3"><Value number="01" title="Clarity" text="Make the story easy to understand." /><Value number="02" title="Energy" text="Make the experience worth remembering." /><Value number="03" title="Care" text="Make the details feel intentional." /></div>
      </div>
    </main>
  );
}

function Badge({ label }: { label: string }) { return <span className="inline-flex rounded-full border border-cyan-100/15 bg-cyan-100/[0.04] px-3 py-2 font-mono text-xs text-cyan-100/75">{label}</span>; }
function Value({ number, title, text }: { number: string; title: string; text: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><p className="font-mono text-xs text-brand-pink">{number}</p><h2 className="mt-10 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-white/45">{text}</p></div>; }
