import { getLocale } from "next-intl/server";

const copy = {
  en: {
    eyebrow: "About",
    title: "A compact senior team for serious digital products.",
    body: "We combine architecture, product design, and full-stack engineering to help teams ship systems that feel premium and operate reliably.",
    principles: [
      { title: "Architecture first", body: "Data, auth, permissions, and deployment constraints are mapped before visual polish begins." },
      { title: "Editorial interfaces", body: "The surface gets rhythm, hierarchy, and motion that supports comprehension instead of distracting from it." },
      { title: "Operational trust", body: "Admin workflows, audit trails, validation, and safe defaults matter as much as the public landing page." },
    ],
    stackTitle: "Core stack",
    valuesTitle: "What we optimize for",
    values: ["Clarity", "Performance", "Security", "Maintainability"],
  },
  ru: {
    eyebrow: "О нас",
    title: "Компактная senior-команда для серьёзных цифровых продуктов.",
    body: "Мы соединяем архитектуру, продуктовый дизайн и full-stack разработку, чтобы системы выглядели премиально и работали надёжно.",
    principles: [
      { title: "Сначала архитектура", body: "Данные, auth, права и деплой проектируются до визуальной полировки." },
      { title: "Редакционные интерфейсы", body: "Поверхность получает ритм, иерархию и движение, которое помогает понимать продукт." },
      { title: "Операционное доверие", body: "Admin workflows, аудит, валидация и безопасные defaults важны не меньше public сайта." },
    ],
    stackTitle: "Основной стек",
    valuesTitle: "Что мы оптимизируем",
    values: ["Ясность", "Скорость", "Безопасность", "Поддерживаемость"],
  },
  uz: {
    eyebrow: "Biz haqimizda",
    title: "Jiddiy raqamli mahsulotlar uchun ixcham senior jamoa.",
    body: "Arxitektura, product design va full-stack engineering birlashib, premium ko'rinadigan va ishonchli ishlaydigan tizimlarni yaratadi.",
    principles: [
      { title: "Avval arxitektura", body: "Data, auth, ruxsatlar va deploy cheklovlari vizual polishdan oldin aniqlanadi." },
      { title: "Editorial interfeyslar", body: "Yuza ritm, ierarxiya va tushunishga yordam beradigan sokin motion oladi." },
      { title: "Operatsion ishonch", body: "Admin workflows, audit, validatsiya va safe defaults public sahifadek muhim." },
    ],
    stackTitle: "Asosiy stack",
    valuesTitle: "Nimani optimallashtiramiz",
    values: ["Aniqlik", "Tezlik", "Xavfsizlik", "Qo'llab-quvvatlash"],
  },
} as const;

const stack = ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "NextAuth", "Three.js", "Tailwind"];

function getCopy(locale: string) {
  if (locale === "ru" || locale === "uz") return copy[locale];
  return copy.en;
}

export default async function AboutPage() {
  const text = getCopy(await getLocale());

  return (
    <main className="min-h-dvh px-6 pb-24 pt-32">
      <section className="section-shell">
        <p className="section-eyebrow">{text.eyebrow}</p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <h1 className="section-title">{text.title}</h1>
          <p className="max-w-xl text-base leading-8 text-white/58 lg:justify-self-end">{text.body}</p>
        </div>
      </section>

      <section className="section-shell grid gap-px border border-white/10 bg-white/10 py-20 lg:grid-cols-3">
        {text.principles.map((principle, index) => (
          <article key={principle.title} className="min-h-[300px] bg-[#05050d] p-7">
            <div className="font-mono text-sm text-teal-200/60">0{index + 1}</div>
            <h2 className="mt-16 text-2xl font-semibold text-white">{principle.title}</h2>
            <p className="mt-4 text-sm leading-7 text-white/52">{principle.body}</p>
          </article>
        ))}
      </section>

      <section className="section-shell grid gap-10 border-t border-white/10 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="section-eyebrow">{text.stackTitle}</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-white">{text.valuesTitle}</h2>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
            {text.values.map((value) => (
              <div key={value} className="bg-[#05050d] p-5 text-sm font-semibold text-white/72">{value}</div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span key={item} className="border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/48">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
