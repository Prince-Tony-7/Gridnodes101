/**
 * Site-wide settings. Personal details, contact options and feature switches
 * all live here so they can be changed in one place.
 */
export const siteConfig = {
  name: "GridNodes",
  title: "GridNodes | Workflow automation for Irish small businesses",
  description:
    "I build n8n automations for Irish small businesses that take the repetitive admin off your plate: client intake, spreadsheet reporting, invoicing, email triage and documents.",
  owner: {
    name: "Prince Tony",
    role: "Manufacturing Process Engineer and automation builder",
    email: "princetony1208@gmail.com",
    linkedin: "https://linkedin.com/in/prince-tony-a0580a1a1",
    location: "Dublin, Ireland",
    /** Put the photo at public/images/prince.jpg; a placeholder shows until then. */
    headshot: "/images/prince.jpg",
  },
  /**
   * Google Apps Script web app that receives contact-form enquiries.
   * Leave empty to switch the online form off (visitors get a mailto link instead).
   */
  enquiryEndpoint: "https://script.google.com/macros/s/AKfycbyZL_LTYEOE5PTtNfhnNwVlNQL7xIg5auv1lmZ_xKd0qlvZXGjHQDtvDR6x17WDhJ_X/exec",
  privacy: {
    /** Shown on the privacy notice. Update whenever the notice changes. */
    lastUpdated: "12 November 2026",
    /** TODO(Prince): confirm this retention period suits you, or change it. */
    retention:
      "I keep enquiries for up to 12 months after our last contact, unless we start working together, in which case I keep what's needed to provide the service and meet my legal obligations.",
  },
  features: {
    /** Set to true to show the Demos page in the nav and the demos section on the home page. */
    demos: false,
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Case study", href: "/case-study" },
    { label: "Examples", href: "/showroom" },
    { label: "Demos", href: "/demos", feature: "demos" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

type NavItem = (typeof siteConfig.nav)[number];

/** Nav items with disabled features filtered out. */
export const navItems = siteConfig.nav.filter(
  (item: NavItem) => !("feature" in item) || siteConfig.features[item.feature],
);
