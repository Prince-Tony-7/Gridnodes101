import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm leading-relaxed text-fg-muted">
            Production-ready n8n automations for teams that have outgrown spreadsheets and copy-paste.
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
          <span className="col-span-2 mb-1 font-mono text-xs tracking-wider text-fg-subtle uppercase">Navigate</span>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-fg-muted transition-colors hover:text-fg">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>

      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} GridNodes. All rights reserved.</p>
          <p className="font-mono">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" aria-hidden />
            All systems operational
          </p>
        </Container>
      </div>
    </footer>
  );
}
