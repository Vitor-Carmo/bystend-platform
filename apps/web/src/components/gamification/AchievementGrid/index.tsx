"use client";

import { ACHIEVEMENTS, getUnlockedAchievements } from "@/lib/gamification";
import { cn } from "@/lib/cn";
import styles from "./AchievementGrid.module.css";

export function AchievementGrid() {
  const unlocked = getUnlockedAchievements();

  return (
    <div className={styles.grid}>
      {ACHIEVEMENTS.map((a) => {
        const isUnlocked = unlocked.includes(a.id);
        return (
          <div key={a.id} className={cn(styles.item, isUnlocked ? styles.unlocked : styles.locked)}>
            <p className={styles.title}>{a.title}</p>
            <p className={styles.desc}>{a.description}</p>
          </div>
        );
      })}
    </div>
  );
}
