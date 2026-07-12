import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

/**
 * Seed policy
 * ───────────
 * By default this seeds ONLY the admin user + empty site settings. It does NOT
 * publish any people, projects, testimonials or metrics — those must be real
 * content entered through the admin (see CONTENT_REQUIRED.md).
 *
 * For local development/QA you can populate obviously-labelled DEMO content:
 *     SEED_DEMO=true npm run seed
 * Demo records are prefixed "Demo —" and localized (uz base + en/ru overrides)
 * so the multilingual content path can be exercised locally. Never run
 * SEED_DEMO against production.
 */

const DEFAULT_ADMIN_PASSWORD = "ChangeMe123!";

async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@feruz.dev";
  const password = process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN_PASSWORD;

  // Never seed the well-known default password into a production database.
  if (
    process.env.NODE_ENV === "production" &&
    password === DEFAULT_ADMIN_PASSWORD &&
    process.env.ALLOW_INSECURE_SEED !== "true"
  ) {
    throw new Error(
      "Refusing to seed the default admin password in production. Set SEED_ADMIN_PASSWORD to a strong value (or ALLOW_INSECURE_SEED=true to override).",
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { hashedPassword, role: "ADMIN" },
    create: { email, name: "Admin", hashedPassword, role: "ADMIN" },
  });

  // Empty, editable site settings shell (no fabricated contact details).
  await prisma.setting.upsert({
    where: { key: "contact" },
    update: {},
    create: { key: "contact", value: {} },
  });

  console.log(`✓ Admin user ready: ${email}`);
  return admin;
}

async function seedDemo() {
  console.log("→ SEED_DEMO=true — inserting labelled demo content…");

  const author = await prisma.user.upsert({
    where: { email: "editor@feruz.dev" },
    update: { role: "EDITOR" },
    create: { email: "editor@feruz.dev", name: "Demo Editor", hashedPassword: await bcrypt.hash("ChangeMe123!", 12), role: "EDITOR" },
  });

  // Team (base = uz, translations = en/ru). Clearly DEMO people.
  const t1 = await prisma.teamMember.upsert({
    where: { slug: "demo-lead-engineer" },
    update: {},
    create: {
      slug: "demo-lead-engineer",
      fullName: "Demo — Lead Engineer",
      position: "Bosh muhandis",
      department: "Muhandislik",
      shortBio: "Namuna profil — haqiqiy ma'lumot bilan almashtiring.",
      bio: "Bu namuna tarjimai hol. Iltimos, admin panel orqali haqiqiy ma'lumot kiriting.\n\nIkkinchi paragraf.",
      skills: ["Next.js", "TypeScript", "PostgreSQL", "Node.js"],
      certifications: [],
      yearsOfExp: 6,
      isActive: true,
      order: 0,
      translations: {
        en: { position: "Lead Engineer", department: "Engineering", shortBio: "Demo profile — replace with real content.", bio: "This is a demo biography. Please add real content via the admin.\n\nSecond paragraph." },
        ru: { position: "Ведущий инженер", department: "Инженерия", shortBio: "Демо-профиль — замените реальным содержимым.", bio: "Это демонстрационная биография. Добавьте реальный контент через админку.\n\nВторой абзац." },
      },
    },
  });

  const t2 = await prisma.teamMember.upsert({
    where: { slug: "demo-product-designer" },
    update: {},
    create: {
      slug: "demo-product-designer",
      fullName: "Demo — Product Designer",
      position: "Mahsulot dizayneri",
      department: "Dizayn",
      shortBio: "Namuna profil.",
      bio: "Namuna dizayner tarjimai holi.",
      skills: ["Figma", "Design Systems", "Prototyping"],
      certifications: [],
      yearsOfExp: 5,
      isActive: true,
      order: 1,
      translations: {
        en: { position: "Product Designer", department: "Design", shortBio: "Demo profile.", bio: "Demo designer biography." },
        ru: { position: "Продуктовый дизайнер", department: "Дизайн", shortBio: "Демо-профиль.", bio: "Демо-биография дизайнера." },
      },
    },
  });

  // Projects (base = uz + en/ru translations).
  const projectsData = [
    {
      slug: "demo-analytics-platform",
      title: "Demo — Analitika platformasi",
      description: "Namuna loyiha tavsifi — haqiqiy keys bilan almashtiring.",
      challenge: "Namuna: hal qilinishi kerak bo'lgan muammo.",
      solution: "Namuna: taklif qilingan yechim.",
      architecture: "Next.js, PostgreSQL, Prisma.",
      results: "Namuna natija tavsifi.",
      category: "Veb-platforma",
      industry: "Namuna",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
      featured: true,
      en: { title: "Demo — Analytics Platform", description: "Sample project description — replace with a real case study.", challenge: "Sample: the problem to solve.", solution: "Sample: the proposed solution.", results: "Sample outcome description.", category: "Web platform", industry: "Sample" },
      ru: { title: "Demo — Аналитическая платформа", description: "Пример описания проекта — замените реальным кейсом.", challenge: "Пример: задача для решения.", solution: "Пример: предложенное решение.", results: "Пример описания результата.", category: "Веб-платформа", industry: "Пример" },
    },
    {
      slug: "demo-interactive-site",
      title: "Demo — Interaktiv sayt",
      description: "3D va harakatli namuna loyiha.",
      category: "Interaktiv",
      industry: "Namuna",
      technologies: ["Three.js", "React", "GSAP"],
      featured: true,
      en: { title: "Demo — Interactive Site", description: "A demo 3D / motion project.", category: "Interactive", industry: "Sample" },
      ru: { title: "Demo — Интерактивный сайт", description: "Демо-проект с 3D и анимацией.", category: "Интерактив", industry: "Пример" },
    },
  ];

  const projects = [];
  for (const p of projectsData) {
    const { en, ru, ...base } = p;
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...base, screenshots: [], status: "COMPLETED", translations: { en, ru } },
    });
    projects.push(project);
  }

  // Link team ↔ projects with roles.
  await prisma.projectTeamMember.upsert({
    where: { projectId_memberId: { projectId: projects[0].id, memberId: t1.id } },
    update: {},
    create: { projectId: projects[0].id, memberId: t1.id, role: "Lead Engineer" },
  });
  await prisma.projectTeamMember.upsert({
    where: { projectId_memberId: { projectId: projects[0].id, memberId: t2.id } },
    update: {},
    create: { projectId: projects[0].id, memberId: t2.id, role: "Product Designer" },
  });

  // Services (base uz + en/ru).
  const servicesData = [
    { slug: "demo-web", title: "Veb-ishlab chiqish", description: "Namuna xizmat tavsifi.", icon: "◈", features: ["Next.js ilovalar", "API ishlab chiqish"], order: 0, featured: true, en: { title: "Web development", description: "Sample service description.", features: ["Next.js applications", "API development"] }, ru: { title: "Веб-разработка", description: "Пример описания услуги.", features: ["Приложения на Next.js", "Разработка API"] } },
    { slug: "demo-design", title: "Mahsulot dizayni", description: "Namuna dizayn xizmati.", icon: "◐", features: ["UI/UX", "Design system"], order: 1, en: { title: "Product design", description: "Sample design service.", features: ["UI/UX", "Design system"] }, ru: { title: "Продуктовый дизайн", description: "Пример дизайн-услуги.", features: ["UI/UX", "Дизайн-система"] } },
    { slug: "demo-3d", title: "Interaktiv va 3D", description: "Namuna 3D xizmati.", icon: "◇", features: ["WebGL", "Motion"], order: 2, en: { title: "Interactive & 3D", description: "Sample 3D service.", features: ["WebGL", "Motion"] }, ru: { title: "Интерактив и 3D", description: "Пример 3D-услуги.", features: ["WebGL", "Анимация"] } },
  ];
  for (const s of servicesData) {
    const { en, ru, ...base } = s;
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: { ...base, isActive: true, translations: { en, ru } } });
  }

  // Testimonials (approved) — labelled demo.
  await prisma.testimonial.upsert({
    where: { id: "demo-t1" },
    update: {},
    create: { id: "demo-t1", name: "Demo — Client", position: "Director", company: "Sample Co", content: "Demo testimonial — replace with a verified quote from a real client.", rating: 5, featured: true, approved: true, projectId: projects[0].id },
  });

  // Blog (published) — base uz + en/ru.
  await prisma.blogPost.upsert({
    where: { slug: "demo-article" },
    update: {},
    create: {
      slug: "demo-article",
      title: "Demo — Maqola",
      excerpt: "Namuna maqola qisqacha mazmuni.",
      content: "<p>Bu namuna maqola. Admin panel orqali haqiqiy kontent qo'shing.</p><h2>Bo'lim</h2><p>Ikkinchi paragraf.</p>",
      status: "PUBLISHED",
      publishedAt: new Date("2026-01-15"),
      readingTime: 4,
      authorId: author.id,
      translations: {
        en: { title: "Demo — Article", excerpt: "Sample article summary.", content: "<p>This is a demo article. Add real content via the admin.</p><h2>Section</h2><p>Second paragraph.</p>" },
        ru: { title: "Demo — Статья", excerpt: "Пример краткого содержания статьи.", content: "<p>Это демо-статья. Добавьте реальный контент через админку.</p><h2>Раздел</h2><p>Второй абзац.</p>" },
      },
    },
  });

  console.log("✓ Demo content seeded (2 team, 2 projects, 3 services, 1 testimonial, 1 post).");
}

async function main() {
  if (process.env.SEED_DEMO === "true" && process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed DEMO content in production (SEED_DEMO must not be set in production).");
  }
  await seedAdmin();
  if (process.env.SEED_DEMO === "true") {
    await seedDemo();
  } else {
    console.log("ℹ No demo content seeded. Set SEED_DEMO=true for local sample data.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
