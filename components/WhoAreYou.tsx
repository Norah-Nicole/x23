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

  // GSAP scroll-triggered reveal: cards start collapsed into a single deck
  // near the center card's position, fan out into their resting layout as
  // the section enters the viewport, and collapse back into the deck once
  // it scrolls out of view (in either direction).
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
      duration: 1.5,
      ease: "power3.out",
      stagger: 0.2,
    });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 65%",
      end: "bottom 20%",
      onEnter: () => fanOut.play(),
      onEnterBack: () => fanOut.play(),
      onLeave: () => fanOut.reverse(),
      onLeaveBack: () => fanOut.reverse(),
    });

    return () => {
      trigger.kill();
      fanOut.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <section
      id="content"
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-950 px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40"
    >
      <div className="mx-auto max-w-2xl px-2 text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-blue-400">POSSIBILITIES</span>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          What Are You ?
        </h2>
      </div>

      <div className="relative mx-auto mt-14 flex max-w-4xl flex-col items-center gap-8 sm:mt-16 lg:flex-row lg:items-stretch lg:justify-center lg:gap-6">
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
              className="w-full max-w-[260px] sm:max-w-[280px]"
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
    </section>
  );
}