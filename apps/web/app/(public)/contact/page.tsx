import { getLocale } from "next-intl/server";
import ContactForm from "@/components/public/contact/ContactForm";

const copy = {
  en: {
    eyebrow: "Contact",
    title: "Tell us what needs to become real.",
    body: "Share the product, platform, or operational challenge. We will respond with a clear next step, not a generic sales script.",
    meta: ["Architecture review", "Admin systems", "Premium interfaces"],
  },
  ru: {
    eyebrow: "Контакты",
    title: "Расскажите, что нужно превратить в реальность.",
    body: "Опишите продукт, платформу или операционную задачу. Мы ответим с понятным следующим шагом, без шаблонного sales-текста.",
    meta: ["Архитектурный аудит", "Admin системы", "Премиальные интерфейсы"],
  },
  uz: {
    eyebrow: "Aloqa",
    title: "Nimani real mahsulotga aylantirish kerakligini ayting.",
    body: "Product, platforma yoki operatsion muammoni yozing. Biz umumiy savdo matni emas, aniq keyingi qadam bilan javob beramiz.",
    meta: ["Arxitektura auditi", "Admin tizimlar", "Premium interfeyslar"],
  },
} as const;

function getCopy(locale: string) {
  if (locale === "ru" || locale === "uz") return copy[locale];
  return copy.en;
}

export default async function ContactPage() {
  const text = getCopy(await getLocale());

  return (
    <main className="min-h-dvh px-6 pb-24 pt-32">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section>
          <p className="section-eyebrow">{text.eyebrow}</p>
          <h1 className="section-title mt-5">{text.title}</h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-white/58">{text.body}</p>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
            {text.meta.map((item) => (
              <div key={item} className="bg-[#05050d] p-4 text-xs uppercase tracking-[0.16em] text-white/48">
                {item}
              </div>
            ))}
          </div>
        </section>
        <ContactForm />
      </div>
    </main>
  );
}
