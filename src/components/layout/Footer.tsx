import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site";

const dots = ["bg-coral", "bg-sun", "bg-mint", "bg-sky", "bg-violet", "bg-pink"];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-28 bg-ink text-paper">
      <Container className="py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex gap-2" aria-hidden>
              {dots.map((d, i) => (
                <span key={d} className={`h-4 w-4 rounded-full ${d}`} style={{ transform: `translateY(${i % 2 ? 4 : 0}px)` }} />
              ))}
            </div>
            <p className="mt-6 max-w-xl font-display text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl">
              Got a process that eats Mondays?
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 font-display text-2xl font-bold text-sun underline decoration-2 underline-offset-8 hover:text-coral"
            >
              Tell us about it
              <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
            </Link>
          </div>

          <nav aria-label="Footer" className="flex gap-6 text-sm font-semibold">
            {siteConfig.nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-paper/70 transition-colors hover:text-paper">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:justify-between">
          <p>© {year} GridNodes</p>
          <p>Built on n8n. Run on coffee.</p>
        </div>
      </Container>
    </footer>
  );
}
