import { HeroSlide, NavLink } from "./types";

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