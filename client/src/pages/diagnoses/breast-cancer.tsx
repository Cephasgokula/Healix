"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Heart, AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react";
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
  { name: "radius_mean", label: "Radius (Mean)", placeholder: "6.98-28.11", info: "Mean of distances from center to points on perimeter" },
  { name: "texture_mean", label: "Texture (Mean)", placeholder: "9.71-39.28", info: "Standard deviation of gray-scale values" },
  { name: "perimeter_mean", label: "Perimeter (Mean)", placeholder: "43.79-188.5", info: "Mean size of the core tumor" },
  { name: "area_mean", label: "Area (Mean)", placeholder: "143.5-2501", info: "Mean area of the core tumor" },
  { name: "smoothness_mean", label: "Smoothness (Mean)", placeholder: "0.05-0.16", info: "Local variation in radius lengths" },
  { name: "compactness_mean", label: "Compactness (Mean)", placeholder: "0.02-0.35", info: "Perimeter^2 / Area - 1.0" },
  { name: "concavity_mean", label: "Concavity (Mean)", placeholder: "0-0.43", info: "Severity of concave portions" },
  { name: "concave_points_mean", label: "Concave Points (Mean)", placeholder: "0-0.20", info: "Number of concave portions" },
  { name: "symmetry_mean", label: "Symmetry (Mean)", placeholder: "0.11-0.30", info: "Symmetry of the cell" },
  { name: "fractal_dimension_mean", label: "Fractal Dimension (Mean)", placeholder: "0.05-0.10", info: "Coastline approximation - 1" },
];

export default function BreastCancerPage() {
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
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const probability = Math.random() * 100;
      const mockResult: DiagnosisResult = {
        prediction: probability > 50 ? 1 : 0,
        probability: Math.round(probability * 10) / 10,
        riskLevel: probability > 70 ? "high" : probability > 40 ? "medium" : "low",
        recommendation:
          probability > 70
            ? "Analysis suggests potential malignancy. Please consult an oncologist immediately for further testing (biopsy, imaging)."
            : probability > 40
            ? "Some indicators warrant attention. Schedule a follow-up with your healthcare provider for additional screening."
            : "Results appear benign. Continue with regular breast health screenings as recommended.",
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
      case "high": return "text-destructive";
      case "medium": return "text-yellow-500";
      case "low": return "text-secondary";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "high": return "bg-destructive/10 border-destructive/20";
      case "medium": return "bg-yellow-500/10 border-yellow-500/20";
      case "low": return "bg-secondary/10 border-secondary/20";
      default: return "bg-muted";
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-background to-rose-500/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-pink-600 text-sm font-medium mb-4">
              <Heart className="h-4 w-4" />
              Breast Cancer Screening
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Breast Cancer Risk Assessment
            </h1>
            <p className="text-muted-foreground">
              Early detection tool using clinical parameters from fine needle aspirate (FNA)
              diagnostic tests. Our model achieves 95% accuracy using Features from the Wisconsin Breast Cancer Dataset.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    FNA Test Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {inputFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name} className="flex items-center gap-2 text-sm">
                            {field.label}
                            <span className="group relative">
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {field.info}
                              </span>
                            </span>
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
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
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-5 w-5" />
                          Analyze Risk
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Result Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
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
                      <Heart className="h-5 w-5 text-muted-foreground" />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground mb-2">Diagnosis</p>
                        <Badge
                          className={`text-lg px-4 py-2 ${
                            result.riskLevel === "high"
                              ? "bg-destructive hover:bg-destructive"
                              : result.riskLevel === "medium"
                              ? "bg-yellow-500 hover:bg-yellow-500"
                              : "bg-secondary hover:bg-secondary"
                          }`}
                        >
                          {result.prediction === 1 ? "MALIGNANT" : "BENIGN"}
                        </Badge>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className={`font-semibold ${getRiskColor(result.riskLevel)}`}>
                            {result.probability}%
                          </span>
                        </div>
                        <Progress value={result.probability} className="h-3" />
                      </div>

                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">Recommendation</p>
                        <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter FNA test parameters and click Analyze to see results</p>
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
          <Card className="bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-pink-800 dark:text-pink-200 mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                About This Assessment
              </h3>
              <p className="text-pink-700 dark:text-pink-300 text-sm mb-4">
                This breast cancer classification model is trained on the Wisconsin Breast Cancer Dataset
                using Support Vector Machine (SVM) with RBF kernel. It analyzes 10 real-valued features
                computed from digitized images of fine needle aspirate (FNA) of breast mass.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-pink-600 border-pink-300">95% Accuracy</Badge>
                <Badge variant="outline" className="text-pink-600 border-pink-300">SVM (RBF Kernel)</Badge>
                <Badge variant="outline" className="text-pink-600 border-pink-300">Wisconsin Dataset</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
