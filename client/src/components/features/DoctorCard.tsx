"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Doctor } from "@/types";

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment?: (doctor: Doctor) => void;
}

export function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
            ? "fill-yellow-400/50 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden h-full bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Gradient header */}
        <div className="h-24 bg-gradient-to-br from-primary via-primary/80 to-accent relative">
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={doctor.image} alt={doctor.name} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {doctor.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <CardContent className="pt-16 pb-4 text-center">
          <h3 className="text-lg font-semibold text-foreground">{doctor.name}</h3>
          <p className="text-sm text-muted-foreground mb-3">{doctor.specialization}</p>

          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {renderStars(doctor.rating)}
            <span className="text-sm text-muted-foreground ml-1">({doctor.rating})</span>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {doctor.experience}+ years
            </Badge>
            {doctor.available && (
              <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/30 text-xs">
                Available
              </Badge>
            )}
          </div>

          {/* Location & Contact */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">{doctor.location}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>{doctor.contact}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-3">{doctor.hospital}</p>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => onBookAppointment?.(doctor)}
          >
            Book Appointment
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
