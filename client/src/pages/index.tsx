"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Stethoscope,
  Activity,
  Brain,
  Shield,
  Clock,
  Mic,
  ChevronRight,
  Users,
} from "lucide-react";
import { PageLayout } from "@/components/layout";
import { TypeWriter, ServicesCard, VoiceRecorder } from "@/components/features";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ServiceItem } from "@/types";
import { uploadAudio } from "@/lib/api";
import { toast } from "sonner";

// Services data
const services: ServiceItem[] = [
  {
    id: "1",
    icon: "activity",
    title: "Diabetes Risk Assessment",
    description: "AI-powered analysis of your health parameters to predict diabetes risk with 90% accuracy.",
    href: "/diagnoses/diabetes",
  },
  {
    id: "2",
    icon: "brain",
    title: "Thyroid Disease Check",
    description: "Advanced ML model analyzing your thyroid function indicators with 98% accuracy.",
    href: "/diagnoses/thyroid",
  },
  {
    id: "3",
    icon: "heart",
    title: "Breast Cancer Screening",
    description: "Early detection tool using clinical parameters to assess breast cancer risk.",
    href: "/diagnoses/breast-cancer",
  },
  {
    id: "4",
    icon: "stethoscope",
    title: "Voice Symptom Recording",
    description: "Speak your symptoms and let our AI analyze and transcribe them for medical review.",
    href: "#voice-recorder",
  },
  {
    id: "5",
    icon: "microscope",
    title: "X-Ray Analysis",
    description: "Upload chest X-rays for AI-powered detection of Pneumonia and COVID-19.",
    href: "/diagnoses/pneumonia",
  },
  {
    id: "6",
    icon: "syringe",
    title: "Find Healthcare",
    description: "Connect with nearby hospitals and doctors for appointments and consultations.",
    href: "/hospitals",
  },
];

// Why choose us data
const whyChooseUs = [
  {
    icon: Brain,
    title: "AI-Powered Diagnostics",
    description: "Advanced machine learning models trained on thousands of medical cases.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your health data is encrypted and never shared without your consent.",
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get diagnostic predictions and risk assessments in seconds.",
  },
  {
    icon: Users,
    title: "Expert Verified",
    description: "All AI models are validated by healthcare professionals.",
  },
];

// Stats data
const stats = [
  { value: "98%", label: "Diagnosis Accuracy" },
  { value: "50K+", label: "Patients Helped" },
  { value: "100+", label: "Partner Hospitals" },
  { value: "24/7", label: "AI Availability" },
];

export default function HomePage() {
  // Auth state - check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [userEmail, setUserEmail] = React.useState("");

  React.useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    const name = sessionStorage.getItem("userName");
    const email = sessionStorage.getItem("userEmail");
    
    if (jwt) {
      setIsLoggedIn(true);
      setUserName(name || "User");
      setUserEmail(email || "");
    }
  }, []);

  const handleVoiceUpload = async (blob: Blob, transcript: string) => {
    try {
      const result = await uploadAudio({
        audioBlob: blob,
        transcript,
        name: userName,
        email: userEmail,
      });
      toast.success(`Recording submitted! Urgency score: ${result.urgencyScore}/100`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload recording. Please ensure the server is running.");
      throw error;
    }
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background py-16 lg:py-20">
        {/* Background white */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Stethoscope className="h-4 w-4" />
                AI-Powered Healthcare Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Your Health,{" "}
                <TypeWriter
                  words={["Analyzed", "Predicted", "Protected", "Prioritized"]}
                  typingSpeed={80}
                  deletingSpeed={40}
                  delayBetweenWords={1500}
                />
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Experience the future of healthcare with AI-driven disease prediction,
                voice-based symptom recording, and instant emergency triage.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/diagnoses">
                    Explore Diagnoses
                  </Link>
                </Button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12 pt-8 border-t border-border">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-center sm:text-left"
                  >
                    <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Hero Image/Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Decorative circles */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-8 rounded-full border-2 border-dashed border-primary/20"
                />

                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-primary flex items-center justify-center shadow-2xl shadow-primary/25">
                    <Activity className="h-24 w-24 text-white" />
                  </div>
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-10 left-0 glass rounded-xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">AI Analysis</p>
                      <p className="text-xs text-muted-foreground">98% Accuracy</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-20 right-0 glass rounded-xl p-4 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Mic className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Voice Recording</p>
                      <p className="text-xs text-muted-foreground">Speak your symptoms</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Activity className="h-4 w-4" />
              Our Services
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              AI-Powered Healthcare Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              From disease prediction to emergency triage, our platform offers comprehensive
              health assessment tools powered by advanced machine learning.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServicesCard key={service.id} {...service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Shield className="h-4 w-4" />
                Why Choose Healix
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
                Trusted by Thousands for{" "}
                <span className="text-primary">Accurate Diagnosis</span>
              </h2>
              <p className="text-muted-foreground mb-10 text-lg">
                Our platform combines cutting-edge AI technology with medical expertise
                to provide you with reliable health insights and recommendations.
              </p>

              <div className="space-y-6">
                {whyChooseUs.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="p-10 bg-primary text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <CardContent className="p-0 relative z-10">
                  <Stethoscope className="h-12 w-12 mb-6" />
                  <h3 className="text-2xl font-bold mb-6">Start Your Health Journey</h3>
                  <p className="mb-8 text-white/90 text-base leading-relaxed">
                    Get instant access to AI-powered diagnostics, voice symptom recording,
                    and personalized health recommendations.
                  </p>
                  <Button asChild variant="secondary" className="bg-card text-primary hover:bg-card/90">
                    <Link href="/signup">
                      Create Free Account
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Voice Recorder FAB - Only for logged-in users */}
      {isLoggedIn && (
        <VoiceRecorder onUpload={handleVoiceUpload} />
      )}
    </PageLayout>
  );
}
