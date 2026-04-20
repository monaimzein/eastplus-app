import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EAST PLUS | إيست بلس - توريد مواد البناء والتشطيب",
  description:
    "منصة إيست بلس لتوريد مواد البناء والسباكة والكهرباء والتشطيبات. احصل على عرض سعر خلال 24 ساعة.",
  keywords:
    "مواد بناء, توريد, سباكة, كهرباء, تشطيبات, أدوات صحية, السعودية, مقاولات",
  openGraph: {
    title: "EAST PLUS | إيست بلس",
    description: "نوفر لك كل احتياجات مشروعك بأفضل سعر خلال 24 ساعة",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${arabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-arabic)]">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              direction: "rtl",
              fontFamily: "var(--font-arabic)",
            },
          }}
        />
      </body>
    </html>
  );
}
