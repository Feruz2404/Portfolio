import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <section className="mx-auto max-w-6xl py-20">
          <h1 className="text-4xl font-bold">About</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Enterprise-grade portfolio platform.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
