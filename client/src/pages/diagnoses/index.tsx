"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  Heart,
  Scan,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const diagnoses = [
  {
    id: "diabetes",
    icon: Activity,
    title: "Diabetes Risk Assessment",
    description:
      "Analyze your health parameters to predict the risk of Type 2 Diabetes using our advanced machine learning model with 90% accuracy.",
    accuracy: "90%",
    type: "Parameter-based",
    inputs: ["Glucose", "BMI", "Age", "Blood Pressure", "Insulin Levels"],
    href: "/diagnoses/diabetes",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "thyroid",
    icon: Brain,
    title: "Thyroid Disease Check",
    description:
      "Comprehensive thyroid function analysis using hormone levels and medical history, powered by Random Forest with 98% accuracy.",
    accuracy: "98%",
    type: "Parameter-based",
    inputs: ["T3", "T4", "TSH", "Medical History", "Age"],
    href: "/diagnoses/thyroid",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    id: "breast-cancer",
    icon: Heart,
    title: "Breast Cancer Screening",
    description:
      "Early detection tool using clinical parameters from diagnostic tests to assess breast cancer risk with 95% accuracy.",
    accuracy: "95%",
    type: "Parameter-based",
    inputs: ["Tumor Size", "Texture", "Smoothness", "Compactness"],
    href: "/diagnoses/breast-cancer",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: "pneumonia",
    icon: Scan,
    title: "Pneumonia Detection",
    description:
      "Upload a chest X-ray image for AI-powered detection of pneumonia using deep learning CNN with 92% accuracy.",
    accuracy: "92%",
    type: "Image-based (X-Ray)",
    inputs: ["Chest X-Ray Image"],
    href: "/diagnoses/pneumonia",
    gradient: "from-blue-500 to-cyan-500",
    badge: "Image Analysis",
  },
  {
    id: "covid",
    icon: Scan,
    title: "COVID-19 Analysis",
    description:
      "Analyze chest X-rays for signs of COVID-19 infection using our trained CNN model with 90% detection accuracy.",
    accuracy: "90%",
    type: "Image-based (X-Ray)",
    inputs: ["Chest X-Ray Image"],
    href: "/diagnoses/covid",
    gradient: "from-teal-500 to-green-500",
    badge: "Image Analysis",
  },
];

export default function DiagnosesPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Stethoscope className="h-4 w-4" />
              AI-Powered Diagnostics
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Advanced <span className="text-gradient">Disease Prediction</span> Models
            </h1>
            <p className="text-lg text-muted-foreground">
              Our machine learning models analyze your health parameters to provide
              early risk detection and personalized recommendations. Choose a diagnosis tool below to get started.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Diagnoses Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diagnoses.map((diagnosis, index) => (
              <motion.div
                key={diagnosis.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={diagnosis.href}>
                  <Card className="group h-full bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden">
                    {/* Gradient header */}
                    <div
                      className={`h-2 bg-gradient-to-r ${diagnosis.gradient}`}
                    />
                    <CardContent className="p-6">
                      {/* Icon & Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${diagnosis.gradient} p-3 shadow-lg`}
                        >
                          <diagnosis.icon className="h-full w-full text-white" />
                        </div>
                        {diagnosis.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {diagnosis.badge}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {diagnosis.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {diagnosis.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-primary font-semibold">{diagnosis.accuracy}</span>
                          <span className="text-muted-foreground">Accuracy</span>
                        </div>
                        <div className="text-muted-foreground">{diagnosis.type}</div>
                      </div>

                      {/* Input tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {diagnosis.inputs.slice(0, 3).map((input) => (
                          <Badge key={input} variant="outline" className="text-xs font-normal">
                            {input}
                          </Badge>
                        ))}
                        {diagnosis.inputs.length > 3 && (
                          <Badge variant="outline" className="text-xs font-normal">
                            +{diagnosis.inputs.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-primary font-medium text-sm">
                        <span>Start Assessment</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                ⚠️ Medical Disclaimer
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                These AI-powered tools are for preliminary assessment only and should not be used
                as a substitute for professional medical advice, diagnosis, or treatment.
                Always consult with a qualified healthcare provider for any medical concerns.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
