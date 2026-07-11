import { ProjectStatus, Prisma } from "@prisma/client";
import { databaseIsConfigured, prisma } from "@/lib/db";
import { publicProjectSelect, PUBLIC_PROJECT_STATUSES, publicProjectWhere } from "@/lib/publicData";

export type PublicProject = Prisma.ProjectGetPayload<{ select: typeof publicProjectSelect }>;

const fallbackProjects: PublicProject[] = [
  {
    id: "fallback-atlas",
    title: "Atlas Commerce",
    slug: "atlas-commerce",
    description: "A conversion-focused commerce experience built around speed, clarity, and a little bit of motion.",
    challenge: null,
    solution: null,
    architecture: null,
    results: null,
    category: "Product engineering",
    industry: "Commerce",
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
    screenshots: [],
    videoUrl: null,
    liveUrl: null,
    vercelUrl: null,
    githubUrl: null,
    clientName: null,
    clientLogo: null,
    status: ProjectStatus.COMPLETED,
    featured: true,
    startDate: null,
    endDate: null,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01")
  },
  {
    id: "fallback-signal",
    title: "Signal OS",
    slug: "signal-os",
    description: "A calm analytics workspace that turns noisy operational data into decisions people can act on.",
    challenge: null,
    solution: null,
    architecture: null,
    results: null,
    category: "Interface systems",
    industry: "SaaS",
    technologies: ["React", "Motion", "Data viz"],
    screenshots: [],
    videoUrl: null,
    liveUrl: null,
    vercelUrl: null,
    githubUrl: null,
    clientName: null,
    clientLogo: null,
    status: ProjectStatus.IN_PROGRESS,
    featured: true,
    startDate: null,
    endDate: null,
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01")
  },
  {
    id: "fallback-orbit",
    title: "Orbit Studio",
    slug: "orbit-studio",
    description: "A playful digital studio identity with a spatial navigation system and a portfolio that feels alive.",
    challenge: null,
    solution: null,
    architecture: null,
    results: null,
    category: "Creative technology",
    industry: "Studio",
    technologies: ["Three.js", "WebGL", "Brand systems"],
    screenshots: [],
    videoUrl: null,
    liveUrl: null,
    vercelUrl: null,
    githubUrl: null,
    clientName: null,
    clientLogo: null,
    status: ProjectStatus.COMPLETED,
    featured: true,
    startDate: null,
    endDate: null,
    createdAt: new Date("2024-10-01"),
    updatedAt: new Date("2024-10-01")
  }
];

export async function getPublicProjects(): Promise<PublicProject[]> {
  const apiUrl = process.env.PORTFOLIO_API_URL?.replace(/\/$/, "");
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/api/v1/projects`, { next: { revalidate: 60 } });
      if (response.ok) {
        const projects = (await response.json()) as PublicProject[];
        if (Array.isArray(projects) && projects.length) return projects;
      }
    } catch {
      // The web app keeps a Prisma fallback while the standalone API is unavailable.
    }
  }

  if (!databaseIsConfigured) return fallbackProjects;

  try {
    const projects = await prisma.project.findMany({
      where: publicProjectWhere,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      select: publicProjectSelect
    });

    return projects.length ? projects : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export async function getFeaturedProjects() {
  const projects = await getPublicProjects();
  return projects.filter((project) => project.featured).slice(0, 3);
}

export async function getPublicProjectBySlug(slug: string) {
  if (!databaseIsConfigured) return fallbackProjects.find((project) => project.slug === slug) ?? null;

  try {
    return await prisma.project.findFirst({
      where: { slug, status: { in: PUBLIC_PROJECT_STATUSES } },
      select: publicProjectSelect
    });
  } catch {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }
}
