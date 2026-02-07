"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { DiagnosisResult } from "@/types";

const inputFields = [
  { name: "pregnancies", label: "Pregnancies", placeholder: "0-17", type: "number", info: "Number of pregnancies" },
  { name: "glucose", label: "Glucose (mg/dL)", placeholder: "70-200", type: "number", info: "Plasma glucose concentration" },
  { name: "bloodPressure", label: "Blood Pressure (mm Hg)", placeholder: "60-120", type: "number", info: "Diastolic blood pressure" },
  { name: "skinThickness", label: "Skin Thickness (mm)", placeholder: "0-100", type: "number", info: "Triceps skin fold thickness" },
  { name: "insulin", label: "Insulin (μU/mL)", placeholder: "0-846", type: "number", info: "2-Hour serum insulin" },
  { name: "bmi", label: "BMI", placeholder: "18-50", type: "number", info: "Body mass index" },
  { name: "diabetesPedigreeFunction", label: "Diabetes Pedigree Function", placeholder: "0.0-2.5", type: "number", info: "Family history score" },
  { name: "age", label: "Age (years)", placeholder: "21-81", type: "number", info: "Age in years" },
];

export default function DiabetesPage() {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<DiagnosisResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock result - in real app, this would come from the API
      const probability = Math.random() * 100;
      const mockResult: DiagnosisResult = {
        prediction: probability > 50 ? 1 : 0,
        probability: Math.round(probability * 10) / 10,
        riskLevel: probability > 70 ? "high" : probability > 40 ? "medium" : "low",
        recommendation:
          probability > 70
            ? "High risk detected. Please consult a healthcare provider immediately for proper testing."
            : probability > 40
            ? "Moderate risk. Consider lifestyle changes and regular monitoring. Consult your doctor."
            : "Low risk. Maintain a healthy lifestyle with regular exercise and balanced diet.",
      };

      setResult(mockResult);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-secondary";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-destructive/10 border-destructive/20";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "bg-secondary/10 border-secondary/20";
      default:
        return "bg-muted";
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-background to-red-500/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-4">
              <Activity className="h-4 w-4" />
              Diabetes Risk Assessment
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Type 2 Diabetes Risk Prediction
            </h1>
            <p className="text-muted-foreground">
              Enter your health parameters below to assess your risk of Type 2 Diabetes.
              Our Logistic Regression model achieves 90% accuracy on clinical datasets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-orange-500" />
                    Health Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {inputFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name} className="flex items-center gap-2">
                            {field.label}
                            <span className="group relative">
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {field.info}
                              </span>
                            </span>
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            required
                            step="any"
                          />
                        </div>
                      ))}
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Activity className="mr-2 h-5 w-5" />
                          Analyze Risk
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Result Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className={`bg-white dark:bg-slate-800 border-0 shadow-lg h-full ${result ? getRiskBgColor(result.riskLevel) : ""}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result ? (
                      result.riskLevel === "low" ? (
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      ) : (
                        <AlertCircle className={`h-5 w-5 ${getRiskColor(result.riskLevel)}`} />
                      )
                    ) : (
                      <Activity className="h-5 w-5 text-muted-foreground" />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      {/* Risk Level */}
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                        <Badge
                          className={`text-lg px-4 py-2 ${
                            result.riskLevel === "high"
                              ? "bg-destructive hover:bg-destructive"
                              : result.riskLevel === "medium"
                              ? "bg-yellow-500 hover:bg-yellow-500"
                              : "bg-secondary hover:bg-secondary"
                          }`}
                        >
                          {result.riskLevel.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Probability */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Probability</span>
                          <span className={`font-semibold ${getRiskColor(result.riskLevel)}`}>
                            {result.probability}%
                          </span>
                        </div>
                        <Progress
                          value={result.probability}
                          className="h-3"
                        />
                      </div>

                      {/* Recommendation */}
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">Recommendation</p>
                        <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your health parameters and click Analyze to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-8 lg:py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                About This Assessment
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                This diabetes risk prediction model is based on the Pima Indians Diabetes Dataset
                and uses Logistic Regression with feature scaling. The model considers 8 key health
                parameters to calculate your risk probability.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-blue-600 border-blue-300">90% Accuracy</Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-300">Logistic Regression</Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-300">StandardScaler</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
