import ContactForm from "@/components/public/contact/ContactForm";

export default function ContactPage() {
  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
          <p className="mt-4 text-white/70">Tell us about your project. We will respond quickly.</p>
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
