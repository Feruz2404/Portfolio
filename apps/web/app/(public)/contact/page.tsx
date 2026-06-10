import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <section className="mx-auto max-w-2xl py-16">
          <h1 className="text-4xl font-bold">Contact</h1>
          <form className="mt-8 grid gap-3" action="/api/contacts" method="post">
            <input className="rounded-md border border-border bg-background px-3 py-2" name="name" placeholder="Name" required />
            <input className="rounded-md border border-border bg-background px-3 py-2" name="email" type="email" placeholder="Email" required />
            <input className="rounded-md border border-border bg-background px-3 py-2" name="company" placeholder="Company" />
            <textarea className="min-h-32 rounded-md border border-border bg-background px-3 py-2" name="message" placeholder="Message" required />
            <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Send</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
