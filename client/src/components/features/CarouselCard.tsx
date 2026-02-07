"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Testimonial } from "@/types";

interface CarouselCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function CarouselCard({ testimonial, className }: CarouselCardProps) {
  const { name, role, avatar, rating, review } = testimonial;

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className={`bg-white dark:bg-slate-800 border-0 shadow-lg h-full ${className}`}>
      <CardContent className="p-6 flex flex-col h-full">
        {/* Quote icon */}
        <div className="mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Quote className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {renderStars(rating)}
        </div>

        {/* Review */}
        <p className="text-muted-foreground flex-1 mb-6 leading-relaxed">
          "{review}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 pt-4 border-t border-border">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
