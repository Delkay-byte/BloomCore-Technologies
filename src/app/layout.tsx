import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HelpChat } from "@/components/HelpChat";
import { JsonLd } from "@/components/JsonLd";
import { BRAND } from "@/lib/brand";
import { organizationSchema, websiteSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const sourceSerif = localFont({
  src: "../assets/fonts/source-serif-4-roman.woff2",
  variable: "--font-source-serif",
  weight: "200 900",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../assets/fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const HOME_TITLE = `${BRAND.name} — Software Development in Ghana`;
const HOME_DESCRIPTION =
  "BloomCore Technologies builds SchemeKnit, MaaCash and TillProof, plus custom software, web applications and data systems for Ghanaian organisations.";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();

const verification: Metadata["verification"] = {
  ...(googleVerification ? { google: googleVerification } : {}),
  ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s — ${BRAND.name}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: BRAND.name,
  authors: [{ name: BRAND.name, url: SITE_URL }],
  creator: BRAND.name,
  publisher: BRAND.name,
  category: "technology",
  formatDetection: { email: true, address: true, telephone: true },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "/",
    siteName: BRAND.name,
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  ...(Object.keys(verification).length > 0 ? { verification } : {}),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#090f0c" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sourceSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t=localStorage.getItem("bloomcore-theme");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();',
          }}
        />
        <a
          href="#main"
          className="sr-only rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <HelpChat />
        <Analytics />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
