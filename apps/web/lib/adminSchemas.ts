import { z } from "zod";

const shortText = (max = 200) => z.string().trim().max(max);
const url = z.string().url().max(2048);

export const serviceSchema = z.object({
  title: shortText(160).min(2),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: shortText(5000).min(10),
  icon: shortText(100).optional().nullable(),
  features: z.array(shortText(300)).max(50).default([]),
  priceFrom: z.number().int().nonnegative().optional().nullable(),
  priceTo: z.number().int().nonnegative().optional().nullable(),
  currency: z.string().trim().length(3).default("USD"),
  duration: shortText(100).optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true)
});

export const serviceUpdateSchema = serviceSchema.partial();

export const testimonialSchema = z.object({
  name: shortText(160).min(2),
  position: shortText(160).optional().nullable(),
  company: shortText(160).optional().nullable(),
  avatar: url.optional().nullable(),
  content: shortText(3000).min(10),
  rating: z.number().int().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  approved: z.boolean().default(false),
  projectId: z.string().cuid().optional().nullable()
});

export const testimonialUpdateSchema = testimonialSchema.partial();

export const caseStudySchema = z.object({
  projectId: z.string().cuid(),
  heroImage: url.optional().nullable(),
  overview: shortText(10000).min(10),
  challenge: shortText(10000).min(10),
  process: shortText(10000).min(10),
  solution: shortText(10000).min(10),
  outcome: shortText(10000).min(10),
  metrics: z.record(z.unknown()).optional().nullable(),
  timeline: z.record(z.unknown()).optional().nullable(),
  published: z.boolean().default(false)
});

export const caseStudyUpdateSchema = caseStudySchema.omit({ projectId: true }).partial();

export const mediaSchema = z.object({
  filename: shortText(255).min(1),
  url: url,
  mimeType: z.string().trim().max(100).regex(/^[\w.+-]+\/[\w.+-]+$/),
  size: z.number().int().positive().max(32 * 1024 * 1024),
  alt: shortText(255).optional().nullable(),
  caption: shortText(1000).optional().nullable(),
  folder: shortText(255).optional().nullable()
});

export const contactUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"]).optional(),
  managerId: z.string().cuid().optional().nullable()
});
