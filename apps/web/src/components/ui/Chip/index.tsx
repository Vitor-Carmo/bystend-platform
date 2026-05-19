"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import styles from "./Chip.module.css";

interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  type?: "button" | "submit";
}

export function Chip({
  active,
  onClick,
  disabled,
  className,
  children,
  icon,
  type = "button",
}: ChipProps) {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion ? {} : { whileTap: { scale: 0.97 } };

  return (
    <motion.button
      type={type}
      className={cn(styles.chip, active && styles.active, className)}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      {...motionProps}
    >
      {icon}
      {children}
    </motion.button>
  );
}
