import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/ReduxProvider";
import { cookies } from 'next/headers'; // next 13.4+

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CourseMaster - Learn Better",
  description: "Best platform for online learning and courses"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Read lang from cookie (set by i18n on client)
  const lang = (await cookies()).get('i18next')?.value || 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
