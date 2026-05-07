"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import {
  Activity,
  Heart,
  Brain,
  Stethoscope,
  Syringe,
  Microscope,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  heart: Heart,
  brain: Brain,
  stethoscope: Stethoscope,
  syringe: Syringe,
  microscope: Microscope,
};

interface ServicesCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  className?: string;
  index?: number;
}

export function ServicesCard({
  icon,
  title,
  description,
  href,
  className,
  index = 0,
}: ServicesCardProps) {
  const Icon = iconMap[icon.toLowerCase()] || Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={href}>
        <Card
          className={cn(
            "group relative overflow-hidden bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer h-full",
            className
          )}
        >
          {/* Teal overlay on hover */}
          <div className="absolute inset-0 bg-card group-hover:bg-primary/5 transition-all duration-500" />

          <CardContent className="p-8 relative z-10">
            {/* Icon container */}
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              className="w-16 h-16 rounded-xl bg-primary p-3 mb-6 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center"
            >
              <Icon className="h-8 w-8 text-white" />
            </motion.div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">{description}</p>

            {/* Learn More */}
            <div className="flex items-center text-primary font-medium">
              <span>Learn More</span>
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </CardContent>

          {/* Decorative corner */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Card>
      </Link>
    </motion.div>
  );
}
