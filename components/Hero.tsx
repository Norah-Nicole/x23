"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/lib/data";

const AUTO_ADVANCE_MS = 10000;

interface HeroProps {
  /** Selector or id of the section to scroll to when "Explore" is triggered */
  nextSectionId?: string;
}

export default function Hero({ nextSectionId = "content" }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeSlide = heroSlides[activeIndex];

  const goTo = useCallback((index: number) => {
    setActiveIndex(((index % heroSlides.length) + heroSlides.length) % heroSlides.length);
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Autoplay the reel, pausing respectfully for reduced-motion users.
  useEffect(() => {
    if (prefersReducedMotion) return;
    timerRef.current = setTimeout(goNext, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, goNext, prefersReducedMotion]);

  const scrollToNext = () => {
    document.getElementById(nextSectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-slate-950">
      {/* Video crossfade layer */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              opacity: { duration: 1.1, ease: "easeInOut" },
              scale: { duration: AUTO_ADVANCE_MS / 1000 + 1.1, ease: "linear" },
            }}
          >
            <video
              key={activeSlide.videoSrc}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              src={activeSlide.videoSrc}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scrim: heavier bottom-left where copy sits, subtle everywhere else */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/30" />

      {/* Reel / frame counter — a real structural label, since this genuinely is a sequence */}
      {/* <div className="absolute left-6 top-1/2 z-10 -translate-y-1/2 font-mono text-xs tracking-[0.25em] text-slate-400 sm:left-10">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-px bg-slate-600/50" aria-hidden />
          <AnimatePresence mode="wait">
            <motion.span
              key={activeSlide.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
              className="inline-block [writing-mode:vertical-rl]"
            >
              REEL {activeSlide.id} — {String(heroSlides.length).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="h-10 w-px bg-slate-600/50" aria-hidden />
        </div>
      </div> */}

      

      {/* Headline + tagline — centered */}
      {/* <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center sm:px-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg">
                {activeSlide.tagline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div> */}

      {/* Floating Explore CTA */}
      <div className="absolute inset-x-0 px-10 bottom-18 z-10 flex justify-center sm:bottom-32">
        <motion.button
          onClick={scrollToNext}
          aria-label="Explore"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
          className="
            group absolute bottom-8 right-6
            z-10
            flex items-center justify-center
            text-white
            cursor-pointer
            sm:bottom-10 sm:right-10
          "
        >
          <ArrowDown
            className="h-10 w-10 origin-center scale-y-150 transition-transform duration-300 group-hover:translate-y-1 sm:h-12 sm:w-12"
            strokeWidth={1.5}
          />
        </motion.button>
      </div>

      {/* Title list — left side, doubles as nav */}
      <div className="absolute inset-y-0 left-6 z-10 flex flex-col justify-center gap-0 sm:left-10 sm:gap-1">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goTo(index)}
              aria-label={`Go to ${slide.headline}`}
              aria-current={isActive}
              className={`relative w-fit whitespace-nowrap text-left font-display text-4xl font-semibold leading-[1.05] tracking-tight transition-colors duration-300 cursor-pointer sm:text-6xl lg:text-7xl ${
                isActive
                  ? "text-white"
                  : "text-slate-500/50 hover:text-slate-300"
              }`}
            >
              {slide.headline}
              {isActive && !prefersReducedMotion && (
                <motion.span
                  layoutId="reel-progress"
                  className="absolute inset-y-0 -left-4 w-[3px] origin-top bg-[#f7ef8a] sm:-left-5"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{
                    duration: AUTO_ADVANCE_MS / 1000,
                    ease: "linear",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}