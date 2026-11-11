"use client";

import { motion } from "framer-motion";
import { ArrowRight, FileSpreadsheet, FileText, Inbox, Receipt, UserPlus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Tilt } from "@/components/motion/Tilt";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/cn";

interface Service {
  icon: LucideIcon;
  title: string;
  pain: string;
  how: string;
  iconBg: string;
}

const SERVICES: Service[] = [
  {
    icon: UserPlus,
    title: "Taking on new clients",
    pain: "Copying enquiry details into spreadsheets, sending the same welcome email and chasing the same documents every time.",
    how: "Website form → client list in Google Sheets → welcome email and checklist from your own Gmail.",
    iconBg: "bg-coral-tint text-coral-deep",
  },
  {
    icon: FileSpreadsheet,
    title: "Reports from spreadsheets",
    pain: "Downloading the same export, filtering it by hand and building the same report every week or month.",
    how: "Excel or CSV export → rules you agree on → a clean report or exception list, emailed on schedule.",
    iconBg: "bg-sky-tint text-sky-deep",
  },
  {
    icon: Receipt,
    title: "Invoicing and billing admin",
    pain: "Building billing workbooks per customer, checking who has paid and remembering to send reminders.",
    how: "Your invoice sheet → per-customer workbooks and polite overdue reminders, sent on time.",
    iconBg: "bg-mint-tint text-mint-deep",
  },
  {
    icon: Inbox,
    title: "Sorting the inbox",
    pain: "A shared inbox where requests, invoices and questions all land together and someone has to sort them.",
    how: "Incoming email → labelled and filed, with attachments saved and the right person notified.",
    iconBg: "bg-violet-tint text-violet-deep",
  },
  {
    icon: FileText,
    title: "Documents and letters",
    pain: "Filling in the same letter, engagement document or summary by hand from details you already have.",
    how: "Details from a sheet or form → a filled-in document, saved to the right folder and ready to send.",
    iconBg: "bg-sun-tint text-sun-deep",
  },
];

/** What I can take off your plate, described by the problem rather than the technology. */
export function Services() {
  return (
    <section id="services" className="py-24">
      <Container>
        <SectionHeading
          kicker="What I can help with"
          kickerClass="bg-coral"
          title="The repetitive jobs that eat your week."
          description="If someone on your team does the same copy-and-paste job every day or week, it can probably be automated. These are the most common ones."
        />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, pain, how, iconBg }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
            >
              <Tilt className="pop flex h-full flex-col rounded-card bg-card p-6 transition-shadow duration-300 hover:shadow-pop-lg" max={4}>
                <span className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-pop-sm", iconBg)}>
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-ink">{title}</h3>
                <p className="mt-2 mb-5 leading-relaxed text-ink-soft">{pain}</p>
                <p className="mt-auto border-t border-line pt-4 text-sm leading-relaxed text-ink-mute">
                  <span className="font-semibold text-ink">How: </span>
                  {how}
                </p>
              </Tilt>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="flex flex-col justify-center rounded-card border border-dashed border-line-strong p-6"
          >
            <p className="text-lg font-semibold text-ink">Something else?</p>
            <p className="mt-2 leading-relaxed text-ink-soft">
              If it involves spreadsheets, email or moving information between tools, tell me about it.
            </p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-coral-deep hover:underline">
              Tell me what takes up your time <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.li>
        </ul>
      </Container>
    </section>
  );
}
