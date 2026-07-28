"use client";

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

export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
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
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.25em] text-slate-500">
                  MENU
                </span>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-16 flex flex-col gap-2"
              >
                {navLinks.map((link) => (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    variants={itemVariants}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 py-3 text-4xl font-display font-medium tracking-tight text-slate-300 transition-colors hover:text-white sm:text-5xl"
                  >
                    <span className="text-sm font-mono text-slate-600 group-hover:text-blue-500">
                      0{navLinks.indexOf(link) + 1}
                    </span>
                    {link.label}
                  </motion.a>
                ))}
              </motion.nav>
            </div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" exit="exit">
              <a
                href="/contact"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Start Something
              </a>
              <p className="mt-6 text-center text-xs text-slate-600">
                Nairobi, Kenya — available for select projects
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}