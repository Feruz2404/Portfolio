import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";

// Layout for the default-locale (uz) pages served without a locale prefix.
// The next-intl middleware still sets the locale context, so getMessages()
// returns the uz message bundle automatically.
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-dvh">
        <Navigation />
        {children}
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
