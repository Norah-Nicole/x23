/**
 * Shared type definitions for the landing page.
 */

export interface HeroSlide {
  /** Unique identifier for the slide */
  id: string;
  /** URL / path to the background video for this slide */
  videoSrc: string;
  /** Primary headline text rendered over the video */
  headline: string;
  /** Supporting tagline rendered beneath the headline */
  tagline: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface ServiceCategory {
  /** Unique identifier, also used as the section anchor slug */
  id: string;
  /** Card title, e.g. "Individuals" */
  title: string;
  /** Background image for the card */
  image: string;
  /** The "For:" bullet list */
  items: string[];
  /** Supporting statement shown on hover/focus */
  statement: string;
  /** "Learn more" destination */
  href: string;
}