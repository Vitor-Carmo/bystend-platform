export const easings = {
  out: [0.16, 1, 0.3, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
};

export const durations = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export const slideRight = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 12 },
};

export const listStagger = {
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};
