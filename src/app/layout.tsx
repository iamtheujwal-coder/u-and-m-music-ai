import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeInitializer } from "@/components/shared/theme-initializer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "U&M Music AI — Your AI Music Studio at Home",
  description:
    "Turn your raw voice into a studio-quality song. Record from home. Upload your vocals. Let AI clean, mix, master, and produce your music.",
  keywords: [
    "AI music",
    "vocal processing",
    "music production",
    "mixing",
    "mastering",
    "auto-tune",
    "vocal cleanup",
    "AI studio",
  ],
  authors: [{ name: "U&M Music AI" }],
  openGraph: {
    title: "U&M Music AI — Your AI Music Studio at Home",
    description:
      "Turn your raw voice into a studio-quality song using AI. No technical skills needed.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        style={{ fontFamily: "var(--font-inter), var(--font-outfit), system-ui, sans-serif" }}
      >
        <ThemeInitializer />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
            },
          }}
        />
      </body>
    </html>
  );
}
