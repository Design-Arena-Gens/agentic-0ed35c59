import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-app",
});

export const metadata: Metadata = {
  title: "MobileWatcher | آنالیز قیمت موبایل",
  description:
    "داشبورد تحلیلی قیمت موبایل با امکان اتصال مستقیم به ربات تلگرام برای جستجوی سریع قیمت فروشگاه‌های معتبر.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
