import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Safari Academy — Nurturing Young Minds Since 2005",
    template: "%s — Safari Academy",
  },
  description:
    "Safari Academy is a future-forward, multi-campus school in Addis Ababa, Ethiopia. Eight campuses, 5,000+ students, nurturing curiosity, character, and creativity since 2005.",
  keywords: [
    "Safari Academy",
    "Addis Ababa school",
    "Ethiopia education",
    "international school",
    "private school Ethiopia",
    "multi-campus school",
  ],
  authors: [{ name: "Joseph James" }],
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
  openGraph: {
    title: "Safari Academy — Nurturing Young Minds Since 2005",
    description:
      "Eight campuses across Addis Ababa. A future-forward education rooted in curiosity, character, and creativity.",
    siteName: "Safari Academy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Safari Academy",
    description: "Nurturing Young Minds • Building Ethiopia's Future Leaders",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${sora.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Providers>{children}</Providers>
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
