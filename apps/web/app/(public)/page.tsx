import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <section className="mx-auto max-w-6xl py-24">
          <h1 className="font-[var(--font-syne)] text-5xl font-extrabold tracking-tight md:text-7xl">
            Enterprise Portfolio
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            World-class portfolio platform (Next.js 15 · Prisma · NextAuth · shadcn/ui).
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
