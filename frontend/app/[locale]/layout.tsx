import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/layout/providers";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "sonner";
import "../globals.css";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodApp — Order Delicious Food",
  description: "Fresh food delivered fast",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();

  const messages = await getMessages();
  const isRtl = locale === "ar";

  return (
    <html lang={locale} dir={isRtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <main className="min-h-screen bg-background">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <Toaster
              position="bottom-center"
              richColors
              toastOptions={{
                classNames: {
                  toast:
                    "rounded-2xl shadow-xl border border-border/60 backdrop-blur-sm font-medium",
                  success: "bg-card text-foreground",
                  error: "bg-card text-foreground",
                },
                duration: 3000,
              }}
            />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
