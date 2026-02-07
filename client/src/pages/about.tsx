"use client";

import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Award,
  Users,
  Building2,
  LineChart,
} from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { icon: Users, value: "50,000+", label: "Patients Served" },
  { icon: Building2, value: "100+", label: "Partner Hospitals" },
  { icon: LineChart, value: "98%", label: "Diagnosis Accuracy" },
  { icon: Award, value: "15+", label: "Industry Awards" },
];

const values = [
  {
    icon: Target,
    title: "Mission",
    description:
      "To democratize healthcare access through AI-powered diagnostics, making quality health assessments available to everyone, everywhere.",
  },
  {
    icon: Eye,
    title: "Vision",
    description:
      "A world where early detection saves lives, and everyone has access to accurate health insights regardless of their location or resources.",
  },
  {
    icon: Heart,
    title: "Values",
    description:
      "Compassion, Innovation, Integrity, and Excellence guide every decision we make in our mission to improve global health outcomes.",
  },
  {
    icon: Shield,
    title: "Commitment",
    description:
      "We are committed to maintaining the highest standards of data privacy and security while delivering cutting-edge AI healthcare solutions.",
  },
];

const team = [
  {
    name: "Dr. Arun Patel",
    role: "Chief Medical Officer",
    bio: "20+ years in clinical medicine and healthcare technology.",
  },
  {
    name: "Priya Krishnan",
    role: "AI Research Lead",
    bio: "PhD in Machine Learning from IIT, specializing in medical AI.",
  },
  {
    name: "Vikram Sharma",
    role: "CTO",
    bio: "Former Google engineer with expertise in scalable health systems.",
  },
  {
    name: "Dr. Sarah Chen",
    role: "Clinical Advisor",
    bio: "Oncologist and health informatics specialist.",
  },
];

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              About Healix
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Revolutionizing Healthcare with{" "}
              <span className="text-gradient">Artificial Intelligence</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Healix is a comprehensive healthcare platform that leverages cutting-edge
              AI and machine learning to provide accurate disease predictions, voice-based
              symptom analysis, and intelligent emergency triage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Mission & Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're driven by a singular purpose: to make healthcare accessible and accurate for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                      <value.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A diverse team of doctors, engineers, and researchers united by a passion for healthcare innovation.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center bg-white dark:bg-slate-800 border-0 shadow-lg overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-accent" />
                  <CardContent className="pt-4 pb-6 px-6 -mt-12">
                    <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-700 border-4 border-white shadow-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {member.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a research project to a platform serving thousands.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {[
              { year: "2022", title: "Founded", description: "Started as a research project in healthcare AI." },
              { year: "2023", title: "First ML Models", description: "Launched diabetes and thyroid prediction models." },
              { year: "2024", title: "Voice Recording", description: "Introduced AI-powered symptom transcription." },
              { year: "2025", title: "50K+ Users", description: "Reached milestone of serving 50,000 patients." },
            ].map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < 3 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-semibold text-foreground mb-1">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
