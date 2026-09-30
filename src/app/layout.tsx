import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const spaceGroteskHeading = Space_Grotesk({subsets:['latin'],variable:'--font-heading'});

const montserrat = Montserrat({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClipForge AI - Turn Long Form Videos into Viral Clips",
  description: "Upload long-form podcasts, interviews, and streams to generate high-converting 9:16 vertical AI clips with dynamic captions and smart face re-framing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("dark h-full bg-black text-zinc-100", "antialiased", geistSans.variable, geistMono.variable, "font-sans", montserrat.variable, spaceGroteskHeading.variable)}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-100 selection:bg-red-600 selection:text-white">{children}</body>
    </html>
  );
}
