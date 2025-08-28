"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
};

export function FeatureCard({ icon, title, text }: FeatureCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
      <Card className="card card-hover glass">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[color:var(--color-brand-navy)]/5 text-[var(--color-brand-navy)]">
            {icon}
          </span>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[15px] text-neutral-700">{text}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
} 