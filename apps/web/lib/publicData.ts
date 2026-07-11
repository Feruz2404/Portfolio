import { Prisma, ProjectStatus } from "@prisma/client";

export const PUBLIC_PROJECT_STATUSES: ProjectStatus[] = [ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED];

export const publicProjectWhere = {
  status: { in: PUBLIC_PROJECT_STATUSES }
};

export const publicProjectSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  challenge: true,
  solution: true,
  architecture: true,
  results: true,
  category: true,
  industry: true,
  technologies: true,
  screenshots: true,
  videoUrl: true,
  liveUrl: true,
  githubUrl: true,
  clientName: true,
  clientLogo: true,
  status: true,
  featured: true,
  startDate: true,
  endDate: true,
  createdAt: true,
  updatedAt: true
} satisfies Prisma.ProjectSelect;

export const publicTeamSelect = {
  id: true,
  fullName: true,
  slug: true,
  position: true,
  avatar: true,
  bio: true,
  skills: true,
  githubUrl: true,
  linkedinUrl: true,
  telegramUrl: true,
  portfolioUrl: true,
  yearsOfExp: true,
  certifications: true,
  isActive: true,
  order: true
} satisfies Prisma.TeamMemberSelect;

export const publicAuthorSelect = {
  id: true,
  name: true,
  image: true
} satisfies Prisma.UserSelect;
