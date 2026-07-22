import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getEnv } from "@/lib/env";

type LocaleCode = "en" | "ru" | "uz";

type ProjectPreview = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  screenshots: string[];
};

type HomeCopy = {
  manifestoEyebrow: string;
  manifestoTitle: string;
  manifestoBody: string;
  manifestoMetrics: Array<{ value: string; label: string }>;
  projectsEyebrow: string;
  projectsTitle: string;
  projectsBody: string;
  fallbackProjects: ProjectPreview[];
  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  capabilities: Array<{ title: string; body: string; meta: string }>;
  processEyebrow: string;
  processTitle: string;
  process: Array<{ step: string; title: string; body: string }>;
  experienceEyebrow: string;
  experienceTitle: string;
  experienceBody: string;
};

const copy: Record<LocaleCode, HomeCopy> = {
  en: {
    manifestoEyebrow: "Manifesto",
    manifestoTitle: "We build calm, durable digital systems for ambitious teams.",
    manifestoBody:
      "The work is not decoration. It is architecture, speed, trust, and a visual language strong enough to make complex products feel inevitable.",
    manifestoMetrics: [
      { value: "15ms", label: "interaction budgets" },
      { value: "0", label: "template shortcuts" },
      { value: "3x", label: "delivery clarity" },
    ],
    projectsEyebrow: "Selected work",
    projectsTitle: "Products with infrastructure under the surface.",
    projectsBody: "A curated look at dashboards, platforms, and operating systems designed for real business pressure.",
    fallbackProjects: [
      {
        id: "aurora",
        title: "Aurora Operations Console",
        slug: "fintech-dashboard",
        description: "A real-time financial command center with role-based workflows, auditability, and dense executive reporting.",
        category: "Fintech platform",
        technologies: ["Next.js", "PostgreSQL", "RBAC", "Analytics"],
        screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"],
      },
      {
        id: "medline",
        title: "MedLine Care Network",
        slug: "healthcare-platform",
        description: "A secure care coordination surface for clinical teams, patient journeys, and data-heavy daily operations.",
        category: "Healthcare system",
        technologies: ["React", "API design", "Compliance", "UX"],
        screenshots: ["https://images.unsplash.com/photo-1576091160399-112ba8eafc09?w=1200&h=800&fit=crop"],
      },
      {
        id: "signal",
        title: "Signal Commerce Engine",
        slug: "ecommerce-api",
        description: "Transaction infrastructure built around inventory truth, automation, and high-throughput customer journeys.",
        category: "Commerce backend",
        technologies: ["Node.js", "Redis", "Prisma", "Scale"],
        screenshots: ["https://images.unsplash.com/photo-1563013544-8f4206b344eb?w=1200&h=800&fit=crop"],
      },
    ],
    capabilitiesEyebrow: "Capabilities",
    capabilitiesTitle: "Strategy, interface, and backend treated as one product system.",
    capabilities: [
      { title: "Product architecture", body: "System maps, route models, database design, and delivery paths before code gets expensive.", meta: "01" },
      { title: "Premium web interfaces", body: "Cinematic, accessible frontends with stable motion, real content hierarchy, and measured performance.", meta: "02" },
      { title: "Admin operations", body: "Role-based dashboards, CRUD workflows, audit trails, validation, and safe operational defaults.", meta: "03" },
      { title: "Performance engineering", body: "Rendering budgets, WebGL fallbacks, image strategy, build hygiene, and production readiness.", meta: "04" },
    ],
    processEyebrow: "Architecture",
    processTitle: "A disciplined path from unclear ambition to shipped product.",
    process: [
      { step: "01", title: "Frame the system", body: "We define users, data, risk, permissions, and the product language before implementation." },
      { step: "02", title: "Build the spine", body: "Auth, data access, routing, validation, and deployment constraints become the foundation." },
      { step: "03", title: "Design the surface", body: "The interface gets editorial rhythm, motion restraint, and clear paths for repeat workflows." },
      { step: "04", title: "Verify the story", body: "Build, lint, typecheck, browser smoke, and production-minded checks close the loop." },
    ],
    experienceEyebrow: "Team model",
    experienceTitle: "Senior product engineering without the ceremony.",
    experienceBody:
      "You get the judgment of a full-stack architect, the eye of a product designer, and the discipline of production engineering in one compact workflow.",
  },
  ru: {
    manifestoEyebrow: "Манифест",
    manifestoTitle: "Мы создаём спокойные и надёжные цифровые системы для амбициозных команд.",
    manifestoBody:
      "Это не декор. Это архитектура, скорость, доверие и визуальный язык, который делает сложные продукты понятными и убедительными.",
    manifestoMetrics: [
      { value: "15 мс", label: "бюджет реакции" },
      { value: "0", label: "шаблонных решений" },
      { value: "3x", label: "ясность поставки" },
    ],
    projectsEyebrow: "Избранные проекты",
    projectsTitle: "Продукты, под которыми есть настоящая инфраструктура.",
    projectsBody: "Дашборды, платформы и операционные системы, рассчитанные на реальную нагрузку бизнеса.",
    fallbackProjects: [
      {
        id: "aurora",
        title: "Aurora Operations Console",
        slug: "fintech-dashboard",
        description: "Финансовый командный центр с ролями, аудитом и плотной управленческой аналитикой.",
        category: "Fintech платформа",
        technologies: ["Next.js", "PostgreSQL", "RBAC", "Analytics"],
        screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"],
      },
      {
        id: "medline",
        title: "MedLine Care Network",
        slug: "healthcare-platform",
        description: "Защищённая система координации для клинических команд, пациентов и ежедневных процессов.",
        category: "Healthcare система",
        technologies: ["React", "API design", "Compliance", "UX"],
        screenshots: ["https://images.unsplash.com/photo-1576091160399-112ba8eafc09?w=1200&h=800&fit=crop"],
      },
      {
        id: "signal",
        title: "Signal Commerce Engine",
        slug: "ecommerce-api",
        description: "Транзакционная инфраструктура для инвентаря, автоматизации и высоконагруженных клиентских путей.",
        category: "Commerce backend",
        technologies: ["Node.js", "Redis", "Prisma", "Scale"],
        screenshots: ["https://images.unsplash.com/photo-1563013544-8f4206b344eb?w=1200&h=800&fit=crop"],
      },
    ],
    capabilitiesEyebrow: "Возможности",
    capabilitiesTitle: "Стратегия, интерфейс и backend как единая продуктовая система.",
    capabilities: [
      { title: "Продуктовая архитектура", body: "Карта системы, маршруты, база данных и путь поставки до того, как код станет дорогим.", meta: "01" },
      { title: "Премиальные интерфейсы", body: "Кинематографичные и доступные фронтенды с устойчивым движением и ясной иерархией.", meta: "02" },
      { title: "Admin операции", body: "RBAC, CRUD, аудит, валидация и безопасные рабочие процессы для команды.", meta: "03" },
      { title: "Performance engineering", body: "Бюджеты рендера, WebGL fallback, изображения, сборка и готовность к production.", meta: "04" },
    ],
    processEyebrow: "Архитектура",
    processTitle: "Дисциплинированный путь от идеи к запущенному продукту.",
    process: [
      { step: "01", title: "Формируем систему", body: "Определяем пользователей, данные, риски, права и язык продукта до реализации." },
      { step: "02", title: "Собираем основу", body: "Auth, данные, маршруты, валидация и деплой становятся фундаментом." },
      { step: "03", title: "Проектируем поверхность", body: "Интерфейс получает ритм, сдержанное движение и понятные рабочие пути." },
      { step: "04", title: "Проверяем историю", body: "Build, lint, typecheck, browser smoke и production-проверки закрывают цикл." },
    ],
    experienceEyebrow: "Модель команды",
    experienceTitle: "Сеньорная продуктовая инженерия без лишней церемонии.",
    experienceBody:
      "Вы получаете мышление full-stack архитектора, взгляд продуктового дизайнера и дисциплину production-инженера в одном компактном процессе.",
  },
  uz: {
    manifestoEyebrow: "Manifest",
    manifestoTitle: "Ambitsiyali jamoalar uchun sokin, mustahkam raqamli tizimlar quramiz.",
    manifestoBody:
      "Bu bezak emas. Bu arxitektura, tezlik, ishonch va murakkab mahsulotlarni tabiiy his qildiradigan vizual til.",
    manifestoMetrics: [
      { value: "15 ms", label: "reaksiya budjeti" },
      { value: "0", label: "shablon yondashuv" },
      { value: "3x", label: "yetkazish aniqligi" },
    ],
    projectsEyebrow: "Tanlangan ishlar",
    projectsTitle: "Tashqi ko'rinish ostida haqiqiy infratuzilma bor.",
    projectsBody: "Biznes bosimiga tayyor dashboard, platforma va operatsion tizimlardan tanlangan namunalar.",
    fallbackProjects: [
      {
        id: "aurora",
        title: "Aurora Operations Console",
        slug: "fintech-dashboard",
        description: "Rollar, audit va rahbarlar uchun zich analitika bilan real vaqt moliyaviy boshqaruv markazi.",
        category: "Fintech platforma",
        technologies: ["Next.js", "PostgreSQL", "RBAC", "Analytics"],
        screenshots: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop"],
      },
      {
        id: "medline",
        title: "MedLine Care Network",
        slug: "healthcare-platform",
        description: "Klinik jamoalar, bemor yo'llari va kundalik jarayonlar uchun xavfsiz koordinatsiya tizimi.",
        category: "Healthcare tizim",
        technologies: ["React", "API design", "Compliance", "UX"],
        screenshots: ["https://images.unsplash.com/photo-1576091160399-112ba8eafc09?w=1200&h=800&fit=crop"],
      },
      {
        id: "signal",
        title: "Signal Commerce Engine",
        slug: "ecommerce-api",
        description: "Inventar, avtomatlashtirish va katta trafikdagi mijoz yo'llari uchun tranzaksiya infratuzilmasi.",
        category: "Commerce backend",
        technologies: ["Node.js", "Redis", "Prisma", "Scale"],
        screenshots: ["https://images.unsplash.com/photo-1563013544-8f4206b344eb?w=1200&h=800&fit=crop"],
      },
    ],
    capabilitiesEyebrow: "Imkoniyatlar",
    capabilitiesTitle: "Strategiya, interfeys va backend bitta mahsulot tizimi sifatida.",
    capabilities: [
      { title: "Mahsulot arxitekturasi", body: "Tizim xaritasi, route modeli, data tuzilmasi va yetkazish yo'li kod qimmatlashmasidan oldin.", meta: "01" },
      { title: "Premium web interfeyslar", body: "Kinematik, accessible frontendlar, barqaror motion va aniq kontent ierarxiyasi.", meta: "02" },
      { title: "Admin operatsiyalar", body: "RBAC, CRUD, audit trail, validatsiya va jamoa uchun xavfsiz ish oqimlari.", meta: "03" },
      { title: "Performance engineering", body: "Render budjetlari, WebGL fallback, image strategy, build hygiene va production tayyorgarlik.", meta: "04" },
    ],
    processEyebrow: "Arxitektura",
    processTitle: "Noaniq ambitsiyadan ishga tushgan mahsulotgacha tartibli yo'l.",
    process: [
      { step: "01", title: "Tizimni ramkalaymiz", body: "Foydalanuvchi, data, risk, ruxsatlar va mahsulot tilini avval belgilaymiz." },
      { step: "02", title: "Asosni quramiz", body: "Auth, data access, routing, validatsiya va deploy cheklovlari poydevorga aylanadi." },
      { step: "03", title: "Yuzani loyihalaymiz", body: "Interfeys editorial ritm, sokin motion va takroriy ishlar uchun aniq yo'l oladi." },
      { step: "04", title: "Hikoyani tekshiramiz", body: "Build, lint, typecheck, browser smoke va production tekshiruvlar tsiklni yopadi." },
    ],
    experienceEyebrow: "Jamoa modeli",
    experienceTitle: "Ortiqcha marosimsiz senior product engineering.",
    experienceBody:
      "Siz bitta ixcham jarayonda full-stack arxitektor fikrini, product designer ko'zini va production engineer intizomini olasiz.",
  },
};

function isLocaleCode(locale: string): locale is LocaleCode {
  return locale === "en" || locale === "ru" || locale === "uz";
}

async function getProjectPreviews(localeCopy: HomeCopy) {
  if (!getEnv().DATABASE_URL) return localeCopy.fallbackProjects;

  try {
    const { prisma } = await import("@/lib/db");
    const projects = await prisma.project.findMany({
      where: { status: "COMPLETED" },
      orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        technologies: true,
        screenshots: true,
      },
    });

    return projects.length ? projects : localeCopy.fallbackProjects;
  } catch {
    return localeCopy.fallbackProjects;
  }
}

export default async function ServerContent() {
  const activeLocale = await getLocale();
  const localeCopy = copy[isLocaleCode(activeLocale) ? activeLocale : "en"];
  const projects = await getProjectPreviews(localeCopy);

  return (
    <>
      <section className="section-shell grid gap-12 border-b border-white/10 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="section-eyebrow">{localeCopy.manifestoEyebrow}</p>
          <h2 className="section-title mt-5 max-w-3xl">{localeCopy.manifestoTitle}</h2>
        </div>
        <div className="space-y-8">
          <p className="max-w-2xl text-lg leading-8 text-white/58">{localeCopy.manifestoBody}</p>
          <div className="grid grid-cols-3 gap-px border border-white/10 bg-white/10">
            {localeCopy.manifestoMetrics.map((metric) => (
              <div key={metric.label} className="bg-[#05050d] p-5">
                <div className="font-mono text-2xl text-white">{metric.value}</div>
                <div className="mt-2 text-[0.66rem] uppercase tracking-[0.18em] text-white/40">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-28">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="section-eyebrow">{localeCopy.projectsEyebrow}</p>
            <h2 className="section-title mt-5">{localeCopy.projectsTitle}</h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-white/56 lg:justify-self-end">{localeCopy.projectsBody}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group relative min-h-[430px] overflow-hidden border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-teal-200/35"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
                {project.screenshots[0] ? (
                  <Image
                    src={project.screenshots[0]}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,rgba(125,243,226,0.18),rgba(255,255,255,0.03))]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020208] via-transparent to-transparent" />
                <span className="absolute left-4 top-4 font-mono text-xs text-white/50">0{index + 1}</span>
              </div>
              <div className="pt-6">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-teal-200/68">{project.category}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-white">{project.title}</h3>
                <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/52">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.slice(0, 4).map((technology) => (
                    <span key={technology} className="border border-white/10 px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-white/48">
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#05050b]">
        <div className="section-shell grid gap-12 py-28 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-eyebrow">{localeCopy.capabilitiesEyebrow}</p>
            <h2 className="section-title mt-5">{localeCopy.capabilitiesTitle}</h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {localeCopy.capabilities.map((item) => (
              <article key={item.title} className="grid gap-6 py-8 md:grid-cols-[80px_1fr]">
                <div className="font-mono text-sm text-teal-200/60">{item.meta}</div>
                <div>
                  <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-white/54">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-28">
        <div className="mb-12 max-w-3xl">
          <p className="section-eyebrow">{localeCopy.processEyebrow}</p>
          <h2 className="section-title mt-5">{localeCopy.processTitle}</h2>
        </div>
        <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-4">
          {localeCopy.process.map((item) => (
            <article key={item.step} className="min-h-[280px] bg-[#05050d] p-6">
              <div className="font-mono text-sm text-teal-200/62">{item.step}</div>
              <h3 className="mt-12 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/50">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell grid gap-10 border-t border-white/10 py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="section-eyebrow">{localeCopy.experienceEyebrow}</p>
          <h2 className="section-title mt-5">{localeCopy.experienceTitle}</h2>
        </div>
        <div className="relative border border-white/10 bg-white/[0.025] p-8">
          <div className="absolute left-8 top-0 h-px w-24 bg-teal-200/70" />
          <p className="text-xl leading-9 text-white/66">{localeCopy.experienceBody}</p>
        </div>
      </section>
    </>
  );
}
