"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Achievement } from "@/lib/gamification";
import styles from "./AchievementToast.module.css";

const List = "div" as const;

interface AchievementToastProps {
  items: Achievement[];
}

export function AchievementToast({ items }: AchievementToastProps) {
  return (
    <List className={styles.list} aria-live="polite">
      <AnimatePresence>
        {items.map((a) => (
          <motion.div
            key={a.id}
            className={styles.item}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <p className={styles.title}>Conquista desbloqueada</p>
            <p style={{ fontWeight: 600 }}>{a.title}</p>
            <p className={styles.desc}>{a.description}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </List>
  );
}
