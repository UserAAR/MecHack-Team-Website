"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BrandButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "rounded-full text-white shadow-md transition-transform",
        "hover:scale-[1.03]",
        "bg-[linear-gradient(135deg,var(--color-brand-gold),#ffb84a)]",
        className
      )}
      {...props}
    />
  );
} 