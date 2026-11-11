import { Analytics } from "@/components/Analytics";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HelpChat } from "@/components/HelpChat";
import { JsonLd } from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo";

/**
 * The public marketing shell: header, main landmark, footer and the site-wide
 * client widgets. Kept out of the root layout so the private console at
 * /internal can render its own chrome without the public navigation.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
