import { Container } from "@/components/Page";

/**
 * Shown when the console is reachable but the request carries no valid
 * Cloudflare Access identity. In production Access blocks the request before
 * this renders; this is the honest fallback and the local-development state.
 */
export function ConsoleSignInRequired({ detail }: { detail?: string }) {
  return (
    <section className="flex flex-1 items-center bg-background py-20">
      <Container width="narrow">
        <p className="text-[0.8125rem] font-semibold text-foreground-faint">BloomCore internal</p>
        <h1 className="h2 mt-4">Sign in required</h1>
        <p className="lead mt-5 text-foreground-subtle">
          This area is restricted to authorised BloomCore staff. Access is controlled by Cloudflare
          Access.
        </p>
        {detail && (
          <p className="mt-4 border-l-4 border-gold bg-muted px-4 py-3 text-[0.9375rem] leading-6 text-foreground-subtle">
            {detail}
          </p>
        )}
      </Container>
    </section>
  );
}
