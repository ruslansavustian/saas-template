import { hasLocale, NextIntlClientProvider } from "next-intl";

import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "../providers";
import "@/app/globals.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <div className="main-content h-full min-h-screen flex w-full flex-1">
          {children}
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
