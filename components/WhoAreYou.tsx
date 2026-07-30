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

/** How long the stacked deck holds still before fanning out, in ms. */
const STACK_HOLD_MS = 600;

export default function Possibilities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const STACK_HOLD_MS = 500;

  // GSAP scroll-triggered reveal: cards start collapsed into a single deck
  // near the center card's position, hold briefly in that stacked state,
  // then fan out into their resting layout as the section enters the
  // viewport — and collapse back into the deck once it scrolls out of view
  // (in either direction).
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const center = (cards.length - 1) / 2;

    if (prefersReducedMotion) {
      gsap.set(cards, { xPercent: 0, rotate: 0, scale: 1, opacity: 1 });
      return;
    }

    gsap.set(cards, {
      xPercent: (i: number) => (center - i) * 105,
      rotate: (i: number) => (i - center) * 6,
      scale: 0.92,
      opacity: 0,
    });

    const fanOut = gsap.timeline({ paused: true }).to(cards, {
      xPercent: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15,
    });

    const clearHold = () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
        holdTimeoutRef.current = null;
      }
    };

    const playAfterHold = () => {
      clearHold();
      holdTimeoutRef.current = setTimeout(() => fanOut.play(), STACK_HOLD_MS);
    };

    const reverseNow = () => {
      // Cancel a pending hold so leaving early doesn't fan out belatedly.
      clearHold();
      fanOut.reverse();
    };

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      end: "bottom 20%",
      onEnter: playAfterHold,
      onEnterBack: playAfterHold,
      onLeave: reverseNow,
      onLeaveBack: reverseNow,
    });

    return () => {
      clearHold();
      trigger.kill();
      fanOut.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="content"
      ref={sectionRef}
      className="
        relative
        w-full
        overflow-hidden
        py-24
        sm:py-32
        lg:py-40
        "
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-blue-400">POSSIBILITIES</span>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          What are you trying to make possible?
        </h2>
      </div>

      <div
        className="
            relative
            mx-auto
            mt-16
            w-full
            max-w-7xl
            flex
            flex-col
            items-center
            justify-center
            lg:flex-row
            lg:gap-10
        "
    >
        {services.map((service, index) => {
          const isActive = activeIndex === index;
          const center = (services.length - 1) / 2;

          return (
            <div
              key={service.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              style={{ zIndex: services.length - Math.abs(index - center) }}
              className="
                w-full
                sm:w-[280px]
                lg:w-[320px]
                flex-shrink-0
                "
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
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${service.image})` }}
                  role="img"
                  aria-label={service.title}
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10 transition-opacity duration-500 group-hover:from-slate-950/95" />

                {/* Content */}
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