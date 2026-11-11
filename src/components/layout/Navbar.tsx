"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { buttonBase, buttonStyles } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/lib/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        scrolled || open ? "border-line bg-paper/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative z-0 block rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                      active ? "text-ink" : "text-ink-soft hover:text-ink",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 -z-10 rounded-md bg-ink/[0.06]"
                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Link href="/contact" className={cn(buttonBase, buttonStyles.primary, "px-4 py-2")}>
            Book a call <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-card md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden md:hidden"
          >
            <Container className="flex flex-col gap-2 pt-1 pb-4">
              {siteConfig.nav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-4 py-3 text-base font-medium",
                      active ? "bg-ink/[0.06] text-ink" : "text-ink-soft",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
