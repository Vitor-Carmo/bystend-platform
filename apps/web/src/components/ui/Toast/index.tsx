"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string | null;
  variant?: "default" | "success";
}

export function Toast({ message, variant = "default" }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={cn(styles.toast, variant === "success" && styles.success)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          role="status"
        >
          {variant === "success" && <Check size={18} aria-hidden />}
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
