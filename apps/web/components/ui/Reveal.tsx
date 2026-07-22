"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { tokens } from "@/lib/design/tokens";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  as?: "div" | "li" | "section" | "article" | "span";
};

/**
 * Scroll-triggered entrance. Animates once when it enters the viewport.
 * Fully static (no transform, instant) when the user prefers reduced motion —
 * meaning is never conveyed through motion alone.
 */
export function Reveal({ children, delay = 0, y = 20, as = "div", ...props }: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduce) {
    return (
      <MotionTag {...props} initial={false}>
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: tokens.motion.easeArray }}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers Reveal children. Use with <Reveal> descendants. */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export const revealItem = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: tokens.motion.easeArray } },
};
