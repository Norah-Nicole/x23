"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const philosophyLines = [
  "It is how ideas become visible.",
  "It is how businesses become memorable.",
  "It is how strangers become communities.",
  "It is how stories survive.",
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const manifestoRef = useRef<HTMLParagraphElement>(null);
  const finalRef = useRef<HTMLParagraphElement>(null);
  const goldLineRef = useRef<HTMLDivElement>(null);
  const [isInSection, setIsInSection] = useState(false);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        normal: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };
        const allNodes = [manifestoRef.current, ...lineRefs.current, finalRef.current];

        // Respect reduced motion: skip pin/scrub entirely, just show everything
        if (reduced) {
          gsap.set(allNodes, { opacity: 1, y: 0 });
          if (goldLineRef.current) gsap.set(goldLineRef.current, { scaleY: 1 });
          return;
        }

        const ctx = gsap.context(() => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=250%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          // Manifesto line is visible on entry, holds briefly before the rest builds
          tl.set(manifestoRef.current, { opacity: 1, y: 0 }).to({}, { duration: 0.4 });

          lineRefs.current.forEach((line) => {
            if (!line) return;
            tl.to(line, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          });

          // Gold line grows across the whole sequence, in step with the reveals
          if (goldLineRef.current) {
            tl.to(goldLineRef.current, { scaleY: 1, duration: tl.duration(), ease: "none" }, 0);
          }

          // Held pause — the "final frame" beat before the closing line
          tl.to({}, { duration: 0.8 });

          tl.to(finalRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }).to(
            {},
            { duration: 0.6 }
          );
        }, sectionRef);

        return () => ctx.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="The Kijivuland Philosophy"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-6"
      onMouseEnter={() => setIsInSection(true)}
      onMouseLeave={() => setIsInSection(false)}
    >
      {/* Soft vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Barely-there film grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Decorative element: thin gold line, grows in sync with the scroll sequence */}
      <div
        ref={goldLineRef}
        className="absolute left-8 top-1/2 h-1/2 w-px origin-top scale-y-0 bg-amber-400/60 sm:left-12"
      />

      {/* Surprise: gold ring that trails the cursor, only within this section */}
      <SectionCursor active={isInSection} />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-sm uppercase tracking-[0.35em] text-slate-500">
          The Kijivuland Philosophy
        </h2>

        <p
          ref={manifestoRef}
          className="translate-y-4 font-display text-4xl font-medium leading-tight tracking-tight text-white opacity-0 sm:text-6xl md:text-7xl"
        >
          We believe creativity is not decoration.
        </p>

        <div className="flex flex-col gap-3">
          {philosophyLines.map((line, i) => (
            <p
              key={line}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="translate-y-4 text-xl font-light text-slate-300 opacity-0 sm:text-2xl md:text-3xl"
            >
              {line}
            </p>
          ))}
        </div>

        <p
          ref={finalRef}
          className="mt-10 translate-y-4 font-display text-2xl italic tracking-wide text-amber-400 opacity-0 sm:text-3xl md:text-4xl"
        >
          Kijivuland exists between the first idea and the moment the world finally
          gets to experience it.
        </p>
      </div>
    </section>
  );
}

function SectionCursor({ active }: { active: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return !coarsePointer && !reducedMotion;
  });

  useEffect(() => {
    if (!enabled) return;
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-400/70 mix-blend-difference"
      style={{ x: springX, y: springY }}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    />
  );
}