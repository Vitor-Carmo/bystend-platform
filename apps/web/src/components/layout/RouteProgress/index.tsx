"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./RouteProgress.module.css";

const Bar = "div" as const;

export function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <Bar className={styles.bar} aria-hidden>
      <AnimatePresence>
        {active && (
          <motion.div
            className={styles.fill}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
    </Bar>
  );
}
