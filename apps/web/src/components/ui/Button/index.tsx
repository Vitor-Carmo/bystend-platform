"use client";

import Link from "next/link";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

// Use framer-motion's prop type for the button branch so its lifecycle
// handlers (onAnimationStart, onDrag, ...) don't collide with the native
// DOM event handlers that ButtonHTMLAttributes would bring in.
type ButtonProps = ButtonBaseProps &
  (
    | (HTMLMotionProps<"button"> & { href?: undefined })
    | { href: string; onClick?: never; type?: never; disabled?: boolean }
  );

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  iconLeft,
  iconRight,
  href,
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const classes = cn(
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    className,
  );

  const content = (
    <>
      {loading ? <span className={styles.spinner} aria-hidden /> : iconLeft}
      {children}
      {!loading && iconRight}
    </>
  );

  const motionProps = reduceMotion
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  if (href) {
    return (
      <motion.span {...motionProps} style={{ display: "inline-flex" }}>
        <Link href={href} className={classes}>
          {content}
        </Link>
      </motion.span>
    );
  }

  const { disabled, ...buttonProps } = props as HTMLMotionProps<"button">;

  return (
    <motion.button
      type="button"
      className={classes}
      disabled={disabled || loading}
      {...motionProps}
      {...buttonProps}
    >
      {content}
    </motion.button>
  );
}
