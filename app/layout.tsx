import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { AppProviders } from "@/providers/app-providers";
import { Toaster } from "@/components/ui/sonner";
import { I18nInitializer } from "@/components/common/I18nInitializer";

export const metadata: Metadata = {
  title: "Daewa Zone",
  description: "Daewa Zone is a platform for spiritual growth and development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <QueryProvider>
          <AppProviders>
            <I18nInitializer />
            {children}
          </AppProviders>
        </QueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
