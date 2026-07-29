"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SlideMenu from "./SlideMenu";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!triggerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top -72",
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    return () => st.kill();
  }, []);

  return (
    <>
      <div ref={triggerRef} className="pointer-events-none absolute top-0 h-px w-full" />

      <motion.header
        initial={false}
        animate={{
          marginTop: isScrolled ? 12 : 0,
          marginInline: isScrolled ? 16 : 0,
          borderRadius: isScrolled ? 999 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          isScrolled
            ? "border border-white/10 bg-slate-950/70 shadow-lg shadow-black/20 backdrop-blur-xl"
            : "border border-transparent bg-gradient-to-b from-black/40 via-black/10 to-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-4 sm:px-8">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-white">
            <Image
              src="/images/logos/logo.png"
              alt="Kijivuland"
              width={50}
              height={50}
            />
          </Link>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="relative flex h-11 w-11 items-center justify-center"
          >
            <span className="relative flex h-4 w-6 flex-col items-end justify-between">
              <motion.span
                className="h-[2px] rounded-full bg-white"
                animate={
                  isMenuOpen
                    ? { rotate: 45, y: 7, width: 24 }
                    : { rotate: 0, y: 0, width: 24 }
                }
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
              <motion.span
                className="h-[2px] rounded-full bg-white"
                animate={
                  isMenuOpen
                    ? { rotate: -45, y: -7, width: 24 }
                    : { rotate: 0, y: 0, width: 16 }
                }
                transition={{ duration: 0.35, ease: "easeInOut" }}
              />
            </span>
          </button>
        </nav>
      </motion.header>

      <SlideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}