import { setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

const locales = ["en", "az", "ru"] as const;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  setRequestLocale(locale);

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return <NextIntlClientProvider locale={locale} messages={messages}>{children}</NextIntlClientProvider>;
} 