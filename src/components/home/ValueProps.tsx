"use client";

import { motion } from "framer-motion";
import { BellRing, FileText, KeyRound, Unlock } from "lucide-react";
import { Tilt } from "@/components/motion/Tilt";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

const props = [
  {
    icon: BellRing,
    title: "Nothing fails silently",
    body: "Every workflow includes an error alert. If a step fails, you get an email saying what went wrong, instead of finding out weeks later.",
    className: "lg:col-span-2",
    iconBg: "bg-coral-tint text-coral-deep",
  },
  {
    icon: FileText,
    title: "Documented and handed over",
    body: "Plain-English notes for every step, and a walkthrough when it goes live.",
    className: "",
    iconBg: "bg-sky-tint text-sky-deep",
  },
  {
    icon: KeyRound,
    title: "You own it",
    body: "The workflows run on your own n8n account or server. The files are yours.",
    className: "",
    iconBg: "bg-sun-tint text-sun-deep",
  },
  {
    icon: Unlock,
    title: "No lock-in",
    body: "No long contracts or retainers you can't leave. If you'd rather maintain it yourself, or hand it to someone else later, you can.",
    className: "lg:col-span-2",
    iconBg: "bg-mint-tint text-mint-deep",
  },
];

export function ValueProps() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          kicker="How I build"
          kickerClass="bg-coral"
          title="Simple, reliable and yours."
          description="The same discipline I use in regulated manufacturing: documented, tested and built so problems get noticed."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {props.map(({ icon: Icon, title, body, className, iconBg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 }}
              className={className}
            >
              <Tilt className="pop h-full rounded-card bg-card p-7 transition-shadow duration-300 hover:shadow-pop-lg" max={4}>
              <span
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-pop-sm [transform:translateZ(40px)]",
                  iconBg,
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{body}</p>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
