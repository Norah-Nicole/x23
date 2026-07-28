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
      <div className="absolute left-6 top-1/2 z-10 -translate-y-1/2 font-mono text-xs tracking-[0.25em] text-slate-400 sm:left-10">
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
      </div>

      {/* Headline + tagline — centered */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center sm:px-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="whitespace-pre-line font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {activeSlide.headline}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg">
                {activeSlide.tagline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating Explore CTA */}
      <div className="absolute inset-x-0 px-10 bottom-28 z-10 flex justify-center sm:bottom-32">
        <motion.button
          onClick={scrollToNext}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
          }
          className="
            group relative
            flex items-center justify-center gap-3
            min-w-[140px]
            min-h-[30px]
            rounded-full
            border border-white/20
            bg-white/10
            px-12 py-6
            text-base font-medium tracking-wide
            text-white
            backdrop-blur-xl
            transition-all duration-300
            hover:bg-white/15
            cursor-pointer
          "
        >
          <span
            className="absolute inset-0 -z-10 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-80 explore"
            aria-hidden
          />

          <span>Explore</span>

          <ArrowDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
        </motion.button>
      </div>

      {/* Carousel controller — prev / tick scrubber / next, grouped as one small unit */}
      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center sm:bottom-10">
        <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md">
          <button
            onClick={goPrev}
            aria-label="Previous reel"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {heroSlides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  aria-label={`Go to reel ${slide.id}`}
                  aria-current={isActive}
                  className="group relative flex h-6 w-6 items-center justify-center cursor-pointer"
                >
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ease-out ${
                      isActive ? "w-6 bg-[#f7ef8a]" : "w-2 bg-slate-500/60 group-hover:bg-slate-300"
                    }`}
                  />
                  {isActive && !prefersReducedMotion && (
                    <motion.span
                      layoutId="reel-progress"
                      className="absolute inset-x-0 -bottom-2 h-[2px] origin-left bg-blue-[#f7ef8a]/70"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={goNext}
            aria-label="Next reel"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}