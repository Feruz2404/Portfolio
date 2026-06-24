// Server Component – data fetching happens server-side.
// Client animations are split into HeroSection / CtaSection.
import HeroSection   from "@/components/public/HeroSection";
import ServerContent from "@/app/[locale]/(public)/_sections/ServerContent";
import CtaSection    from "@/components/public/CtaSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServerContent />
      <CtaSection />
    </main>
  );
}
