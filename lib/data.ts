import { HeroSlide, NavLink, ServiceCategory } from "./types";

/**
 * Hero carousel data. Add or remove entries to change the number of
 * background reels — the navbar counter, scrubber, and autoplay logic
 * all derive their length from this array.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "01",
    videoSrc: "/images/hero-carousel/vid1.mp4",
    headline: "Design that moves\nwith intention",
    tagline:
      "I build interfaces where every animation earns its place — for products people remember.",
  },
  {
    id: "02",
    videoSrc: "/images/hero-carousel/vid2.mp4",
    headline: "Engineering, framed\nlike a craft",
    tagline:
      "From safari booking flows to dashboards — systems that hold up under real use.",
  },
  {
    id: "03",
    videoSrc: "/images/hero-carousel/vid3.mp4",
    headline: "Every pixel\nhas a reason",
    tagline:
      "Ten years across product, motion, and front-end architecture, distilled into work.",
  },
];

export const navLinks: NavLink[] = [
  { id: "projects", label: "Projects", href: "/projects" },
  { id: "possibilities", label: "Possibilities", href: "/possibilities" },
  { id: "about", label: "About", href: "/about" },
  { id: "archive", label: "Archive", href: "/archive" },
];

// ---SERVICES----
export const services: ServiceCategory[] = [
  {
    id: "individuals",
    title: "Individuals",
    image: "/images/services/img1.jpg",
    items: ["Artists", "Actors", "Musicians", "Filmmakers", "Creators", "Personal brands"],
    statement: "You have something to express. We help you give it form.",
    href: "/individuals",
  },
  {
    id: "businesses",
    title: "Businesses",
    image: "/images/services/restaurant.jpg",
    items: [
      "Restaurants",
      "Retail businesses",
      "Lifestyle brands",
      "Products",
      "Start-ups",
      "Growing companies",
    ],
    statement: "Your business already has a story. We help people notice it.",
    href: "/businesses",
  },
  {
    id: "organisations",
    title: "Organisations",
    image: "/images/services/corporate.jpg",
    items: [
      "Corporates",
      "NGOs",
      "Institutions",
      "Churches",
      "Cultural organisations",
      "Community groups",
    ],
    statement: "You already carry purpose. We help it reach the people who need it.",
    href: "/organisations",
  },
];