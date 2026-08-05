import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { PixflowMark } from "./logo";

const SEEN_KEY = "pixflow.splash.seen";

/** Premium intro animation, shown once per browser session. */
export function Splash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || window.sessionStorage.getItem(SEEN_KEY)) return;
    window.sessionStorage.setItem(SEEN_KEY, "1");
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 2600);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="splash"
          className="noise fixed inset-0 z-[100] grid place-items-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div
            className="aurora pointer-events-none absolute size-[42rem] rounded-full opacity-60 blur-3xl"
            style={{ backgroundImage: "var(--gradient-brand-soft)" }}
          />
          <div className="relative flex flex-col items-center">
            <div className="relative grid place-items-center">
              <span
                className="pulse-ring absolute size-28 rounded-[2rem]"
                style={{ boxShadow: "0 0 0 2px oklch(0.72 0.22 296 / 45%)" }}
              />
              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotateX: 45 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <PixflowMark className="size-24 drop-shadow-[0_18px_50px_oklch(0.66_0.24_296/60%)]" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 14, letterSpacing: "0.4em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
              transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Pixflow <span className="gradient-text">AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              Turn words into art
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.6 }}
              className="mt-8 text-center text-xs tracking-[0.25em] text-muted-foreground uppercase"
            >
              <p>by Nexcore</p>
              <p className="mt-1 opacity-70">Nexcore by AKF</p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 2.2, ease: "easeInOut" }}
              className="mt-8 h-px w-40 origin-left bg-[image:var(--gradient-brand)]"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
