"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { services } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Possibilities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // GSAP scroll-scrubbed reveal: cards start as a fully-visible, overlapped,
  // tilted deck. As the section scrolls into view they hold briefly, then
  // untilt and fan out into their flat resting layout. Because this is
  // `scrub`-driven (not a one-shot trigger), scrolling back up smoothly
  // re-collapses the deck at any point.
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const center = (cards.length - 1) / 2;

    const resting = { xPercent: 0, yPercent: 0, rotate: 0, scale: 1 };

    if (prefersReducedMotion) {
      gsap.set(cards, resting);
      return;
    }

    // Stacked "deck" look — cards overlap ~90% of their own width and sit
    // at varied tilts/heights, like photos tossed on top of one another.
    // Full opacity throughout: nothing fades, only position/rotation change.
    gsap.set(cards, {
      xPercent: (i: number) => (center - i) * 92,
      yPercent: (i: number) => (i % 2 === 0 ? -3 : 3) * (Math.abs(center - i) + 1),
      rotate: (i: number) => (i - center) * 7,
      scale: 0.94,
      zIndex: (i: number) => cards.length - Math.abs(i - center),
      transformOrigin: "50% 50%",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
        end: "top 30%",
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });

    tl
      // Hold the stacked deck for the first part of the scroll range.
      .to(cards, {
        xPercent: (i: number) => (center - i) * 92,
        yPercent: (i: number) => (i % 2 === 0 ? -3 : 3) * (Math.abs(center - i) + 1),
        rotate: (i: number) => (i - center) * 7,
        scale: 0.94,
        duration: 0.35,
      })
      // Then fan out into the resting, flat layout for the remainder.
      .to(cards, {
        ...resting,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.06,
      });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="content"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-slate-950 py-24 text-white sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-xs tracking-[0.25em] text-blue-400">POSSIBILITIES</span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            What are you trying to make possible?
          </h2>
        </div>

        <div className="relative mx-auto mt-16 flex w-full max-w-7xl flex-col items-center justify-center lg:flex-row lg:gap-10">
          {services.map((service, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={service.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="w-full flex-shrink-0 sm:w-[280px] lg:w-[320px]"
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isActive}
                  onHoverStart={() => setActiveIndex(index)}
                  onHoverEnd={() => setActiveIndex((prev) => (prev === index ? null : prev))}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex((prev) => (prev === index ? null : prev))}
                  onClick={() => setActiveIndex((prev) => (prev === index ? null : index))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveIndex((prev) => (prev === index ? null : index));
                    }
                  }}
                  className="group relative flex aspect-[3/4] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-white/10 bg-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${service.image})` }}
                    role="img"
                    aria-label={service.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10 transition-opacity duration-500 group-hover:from-slate-950/95" />

                  <div className="relative flex flex-col p-5 sm:p-6">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-blue-400">FOR</span>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
                      {service.title}
                    </h3>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-300 sm:text-sm">
                            {service.items.map((item, itemIndex) => (
                              <motion.li
                                key={item}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: itemIndex * 0.04 }}
                              >
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                          <p className="mt-4 text-xs italic leading-relaxed text-slate-400 sm:text-sm">
                            {service.statement}
                          </p>
                          <a
                            href={service.href}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300 sm:text-sm"
                          >
                            Learn more
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}