import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/url";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How GridNodes handles the information you send through the contact form. No cookies, no analytics, no tracking.",
  alternates: { canonical: absoluteUrl("/privacy/") },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

const link = "font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink";

export default function PrivacyPage() {
  const { owner, privacy, features } = siteConfig;
  return (
    <Container className="pt-14">
      <SectionHeading
        as="h1"
        kicker="Privacy"
        kickerClass="bg-coral"
        title="Privacy notice"
        description="Short version: this site has no cookies, no analytics and no tracking. If you use the contact form, I use what you send only to reply to you."
      />
      <p className="mt-4 text-sm text-ink-mute">Last updated: {privacy.lastUpdated}</p>

      <div className="mt-12 max-w-3xl space-y-10 pb-8">
        <Section title="Who I am">
          <p>
            GridNodes is run by {owner.name}, based in {owner.location}. I&rsquo;m the data controller for any personal
            information you send through this website. You can contact me about privacy at{" "}
            <a href={`mailto:${owner.email}`} className={link}>
              {owner.email}
            </a>
            .
          </p>
        </Section>

        <Section title="What I collect">
          <p>Only what you choose to send me:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-ink">Contact form:</strong> your name, email address, your message, and (if you fill
              it in) how you heard about GridNodes.
            </li>
            <li>
              <strong className="text-ink">Email:</strong> if you email me directly, your email address and whatever you
              include in the message.
            </li>
          </ul>
          <p>
            This website does not use cookies, analytics, advertising or tracking scripts, and the fonts are served from
            this site rather than a third party.
          </p>
        </Section>

        <Section title="How I use it">
          <p>
            To read and reply to your enquiry and, if we decide to work together, to provide the service. I don&rsquo;t
            sell your information, share it for marketing, or add you to a mailing list.
          </p>
          <p>
            The legal basis is taking steps at your request before entering into a contract, and my legitimate interest in
            responding to enquiries (GDPR Article 6(1)(b) and 6(1)(f)).
          </p>
        </Section>

        <Section title="Where it goes">
          <p>
            The contact form sends your details to a Google Apps Script in my Google account, and enquiries are stored in
            that account. Google acts as my processor. Google may process data outside the European Economic Area under
            its standard data protection terms.
          </p>
          <p>
            The site is hosted on GitHub Pages. GitHub may log technical information such as IP addresses to keep its
            service secure; see{" "}
            <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer" className={link}>
              GitHub&rsquo;s privacy statement
            </a>
            .
          </p>
          {features.demos && (
            <p>
              Demo videos are hosted on YouTube (privacy-enhanced mode), Vimeo or Loom. Nothing from those services loads
              until you press play; after that, their own privacy policies apply.
            </p>
          )}
        </Section>

        <Section title="How long I keep it">
          <p>{privacy.retention}</p>
        </Section>

        <Section title="Your rights">
          <p>
            You can ask me for a copy of the information I hold about you, or ask me to correct or delete it, restrict or
            object to how I use it, or move it elsewhere. Email{" "}
            <a href={`mailto:${owner.email}`} className={link}>
              {owner.email}
            </a>{" "}
            and I&rsquo;ll respond within one month.
          </p>
          <p>
            If you&rsquo;re unhappy with how I&rsquo;ve handled your information, you can complain to the{" "}
            <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer" className={link}>
              Data Protection Commission
            </a>
            .
          </p>
        </Section>
      </div>
    </Container>
  );
}
