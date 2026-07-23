// Shared animation building blocks. Kept small on purpose — every section
// reuses the same handful of motions so the page feels like one system
// rather than a collage of one-off effects.

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

// Standard viewport trigger — animate once, slightly before the element
// is fully in view so reveals feel anticipatory rather than late.
export const viewportOnce = { once: true, margin: "-80px" };
