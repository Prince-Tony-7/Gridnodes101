import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 bg-deep text-paper">
      <Container className="py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <Logo tone="dark" />
            <p className="mt-8 max-w-xl font-display text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
              Have a process that takes hours every week?
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 font-display text-lg font-medium text-paper underline decoration-paper/30 underline-offset-8 transition-colors hover:decoration-paper"
            >
              Let’s scope the automation
              <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
            </Link>
          </Reveal>

          <nav aria-label="Footer" className="flex gap-6 text-sm font-medium">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-paper/70 transition-colors hover:text-paper">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:justify-between">
          <p>© {year} GridNodes</p>
          <p>n8n automation design, build and support.</p>
        </div>
      </Container>
    </footer>
  );
}
