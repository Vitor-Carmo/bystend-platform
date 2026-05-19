"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import styles from "./Card.module.css";

type Variant = "surface" | "interactive" | "glass";
type Padding = "none" | "sm" | "md" | "lg";

interface CardProps {
  variant?: Variant;
  padding?: Padding;
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  as?: "div" | "article";
}

export function Card({
  variant = "surface",
  padding = "md",
  href,
  className,
  children,
  onClick,
}: CardProps) {
  const reduceMotion = useReducedMotion();
  const classes = cn(styles.card, styles[variant], styles[`padding-${padding}`], className);

  const motionProps = reduceMotion || variant !== "interactive"
    ? {}
    : { whileHover: { y: -2 }, whileTap: { scale: 0.99 } };

  if (href) {
    return (
      <motion.div {...motionProps}>
        <Link href={href} className={cn(classes, styles.interactive)}>
          {children}
        </Link>
      </motion.div>
    );
  }

  if (variant === "interactive" && onClick) {
    return (
      <motion.button type="button" className={cn(classes, styles.interactive)} onClick={onClick} {...motionProps}>
        {children}
      </motion.button>
    );
  }

  return <div className={classes}>{children}</div>;
}
