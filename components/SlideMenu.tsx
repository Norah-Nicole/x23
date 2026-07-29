"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { navLinks } from "@/lib/data";

interface SlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const easing = [0.22, 1, 0.36, 1] as const;

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { duration: 0.5, ease: easing },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.4, ease: easing },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: easing },
  },
  exit: { opacity: 0, x: 24, transition: { duration: 0.3 } },
};

const allLinks = [
  ...navLinks,
  { id: "start-something", href: "/contact", label: "Start Something" },
];

export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col justify-between border-l border-white/10 bg-slate-950/95 px-8 py-10 backdrop-blur-2xl sm:w-[420px]"
          >
            <div className="flex items-center justify-end">
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center"
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <motion.nav
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onMouseLeave={() => setHoveredId(null)}
              className="flex flex-1 flex-col gap-6 py-10"
            >
              {allLinks.map((link) => {
                const isHovered = hoveredId === link.id;
                const isBlurred = hoveredId !== null && !isHovered;

                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    variants={itemVariants}
                    onClick={onClose}
                    onMouseEnter={() => setHoveredId(link.id)}
                    className="block origin-left py-3"
                  >
                    <span
                      className={`inline-block font-display text-4xl font-medium tracking-tight transition-all duration-300 ease-out sm:text-5xl ${
                        isHovered
                          ? "scale-110 text-white blur-0"
                          : isBlurred
                          ? "scale-100 text-slate-300 blur-[2px]"
                          : "scale-100 text-slate-300 blur-0"
                      }`}
                    >
                      {link.label}
                    </span>
                  </motion.a>
                );
              })}
            </motion.nav>

            <motion.p
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center text-xs text-slate-600"
            >
              Nairobi, Kenya — available for select projects
            </motion.p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}