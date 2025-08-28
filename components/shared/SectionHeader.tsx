"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
  children?: React.ReactNode;
};

export function SectionHeader({ eyebrow, title, className, align = "left", children }: SectionHeaderProps) {
  return (
    <div className={cn("mb-6", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-[var(--color-brand-gold)]"
        >
          <span className="inline-block h-px w-6 bg-[var(--color-brand-gold)]" />
          {eyebrow}
        </motion.div>
      ) : null}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className={cn("text-3xl md:text-4xl font-bold mt-2 leading-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.1)]")}
      >
        {title}
      </motion.h2>
      {children ? <div className={cn("mt-3 text-sm text-neutral-700", align === "center" && "mx-auto max-w-2xl")}>{children}</div> : null}
    </div>
  );
} 