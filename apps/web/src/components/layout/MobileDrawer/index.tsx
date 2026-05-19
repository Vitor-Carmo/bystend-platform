"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import styles from "./MobileDrawer.module.css";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
}

export function MobileDrawer({ open, onClose, links, pathname }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.nav
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            aria-label="Menu mobile"
          >
            <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar menu">
              <X size={24} />
            </button>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(styles.link, pathname === l.href && styles.linkActive)}
                onClick={onClose}
              >
                {l.label}
              </Link>
            ))}
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
