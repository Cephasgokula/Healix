"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, Hospital } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { DoctorCard } from "@/components/features";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/types";

// Mock data for doctors/hospitals
const mockDoctors: Doctor[] = [
  {
    _id: "1",
    name: "Dr. Arun Sharma",
    specialization: "Cardiologist",
    rating: 4.8,
    location: "Chennai",
    contact: "+91 98765 43210",
    hospital: "Apollo Hospital",
    experience: 15,
    available: true,
  },
  {
    _id: "2",
    name: "Dr. Priya Patel",
    specialization: "Endocrinologist",
    rating: 4.9,
    location: "Mumbai",
    contact: "+91 98765 43211",
    hospital: "Fortis Healthcare",
    experience: 12,
    available: true,
  },
  {
    _id: "3",
    name: "Dr. Rajesh Kumar",
    specialization: "Oncologist",
    rating: 4.7,
    location: "Delhi",
    contact: "+91 98765 43212",
    hospital: "Max Hospital",
    experience: 20,
    available: false,
  },
  {
    _id: "4",
    name: "Dr. Sunita Reddy",
    specialization: "Pulmonologist",
    rating: 4.6,
    location: "Bangalore",
    contact: "+91 98765 43213",
    hospital: "Manipal Hospital",
    experience: 10,
    available: true,
  },
  {
    _id: "5",
    name: "Dr. Vikram Singh",
    specialization: "General Physician",
    rating: 4.5,
    location: "Hyderabad",
    contact: "+91 98765 43214",
    hospital: "KIMS Hospital",
    experience: 8,
    available: true,
  },
  {
    _id: "6",
    name: "Dr. Ananya Gupta",
    specialization: "Neurologist",
    rating: 4.9,
    location: "Chennai",
    contact: "+91 98765 43215",
    hospital: "MIOT Hospital",
    experience: 14,
    available: true,
  },
];

const specializations = [
  "All Specializations",
  "Cardiologist",
  "Endocrinologist",
  "Oncologist",
  "Pulmonologist",
  "General Physician",
  "Neurologist",
];

const locations = ["All Locations", "Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad"];

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedSpecialization, setSelectedSpecialization] = React.useState("All Specializations");
  const [selectedLocation, setSelectedLocation] = React.useState("All Locations");
  const [filteredDoctors, setFilteredDoctors] = React.useState(mockDoctors);

  React.useEffect(() => {
    let result = mockDoctors;

    if (searchQuery) {
      result = result.filter(
        (doc) =>
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialization !== "All Specializations") {
      result = result.filter((doc) => doc.specialization === selectedSpecialization);
    }

    if (selectedLocation !== "All Locations") {
      result = result.filter((doc) => doc.location === selectedLocation);
    }

    setFilteredDoctors(result);
  }, [searchQuery, selectedSpecialization, selectedLocation]);

  const handleBookAppointment = (doctor: Doctor) => {
    alert(`Booking appointment with ${doctor.name} at ${doctor.hospital}`);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Hospital className="h-4 w-4" />
              Healthcare Network
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Find <span className="text-gradient">Healthcare Providers</span> Near You
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with top-rated doctors and hospitals in your area.
              Book appointments and get the care you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 border-b border-border bg-white dark:bg-slate-900 sticky top-16 lg:top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search doctors or hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Specialization" />
              </SelectTrigger>
              <SelectContent>
                {specializations.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full md:w-48">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-foreground">
              {filteredDoctors.length} Healthcare Providers Found
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {filteredDoctors.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onBookAppointment={handleBookAppointment}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-16 border-0 shadow-lg">
              <CardContent>
                <Hospital className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecialization("All Specializations");
                    setSelectedLocation("All Locations");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
