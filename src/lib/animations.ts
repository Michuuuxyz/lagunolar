/**
 * Framer Motion Animation Variants
 * Lagarto Premium Theme
 */

import { Variants } from "framer-motion";

// Fade In Up - Classic entrance animation
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Fade In - Simple fade
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
  },
};

// Scale In - Scale from center
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
  },
};

// Slide In from Left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: -50,
  },
};

// Slide In from Right
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 50,
  },
};

// Stagger Container - For parent elements
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Stagger Container Fast
export const staggerContainerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

// Hover Scale - For interactive elements
export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  whileTap: {
    scale: 0.95,
  },
};

// Hover Scale Small - Subtle hover
export const hoverScaleSmall = {
  whileHover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
  whileTap: {
    scale: 0.98,
  },
};

// Hover Glow - Add glow on hover
export const hoverGlow = {
  whileHover: {
    boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)",
    transition: {
      duration: 0.3,
    },
  },
};

// Float Animation - Floating effect
export const float: Variants = {
  initial: {
    y: 0,
  },
  animate: {
    y: [-10, 0, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Pulse - Pulsing scale effect
export const pulse: Variants = {
  initial: {
    scale: 1,
  },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Rotate - Spinning animation
export const rotate: Variants = {
  initial: {
    rotate: 0,
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Shimmer - Shimmer effect for backgrounds
export const shimmer = {
  backgroundPosition: ["-1000px 0", "1000px 0"],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear",
  },
};

// Card Hover - Complete card hover effect
export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    scale: 1.03,
    y: -8,
    boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
  },
};

// Modal/Dialog Backdrop
export const modalBackdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Modal/Dialog Content
export const modalContent: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

// Sidebar Slide In
export const sidebarSlide: Variants = {
  closed: {
    x: "-100%",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Dropdown Menu
export const dropdownMenu: Variants = {
  closed: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Page Transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Counter Animation - For numbers
export const counterAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: "easeOut" },
};

// Typewriter effect config
export const typewriterConfig = {
  loop: true,
  delay: 80,
  deleteSpeed: 50,
  delayBetween: 2000,
};

// Spring configs for smooth physics-based animations
export const springConfig = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

export const springConfigSoft = {
  type: "spring",
  stiffness: 100,
  damping: 15,
};

export const springConfigBouncy = {
  type: "spring",
  stiffness: 400,
  damping: 10,
  mass: 0.5,
};
