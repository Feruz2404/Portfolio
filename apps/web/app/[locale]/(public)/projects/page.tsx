import ProjectExplorer from "@/components/portfolio/ProjectExplorer";
import { getPublicProjects } from "@/lib/portfolioData";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <main className="min-h-dvh bg-surface-00 px-6 py-16 sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl"><p className="eyebrow">Selected work / archive</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] sm:text-7xl">Built to be used.<br /><span className="text-white/35">Made to be remembered.</span></h1><p className="mt-6 max-w-xl text-base leading-7 text-white/55">Explore product systems, creative experiments, and digital experiences shaped from the first idea to the last polished detail.</p></div>
        <div className="mt-14"><ProjectExplorer projects={projects} /></div>
      </div>
    </main>
  );
}
