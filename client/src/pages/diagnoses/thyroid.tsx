"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Brain, AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { DiagnosisResult } from "@/types";
import { diagnoseThyroid, type ThyroidPayload } from "@/lib/api";

const numericFields = [
  { name: "age", label: "Age", placeholder: "20-80", info: "Your age in years" },
  { name: "T3", label: "T3 (ng/dL)", placeholder: "0.5-3.0", info: "Triiodothyronine level" },
  { name: "TT4", label: "TT4 (μg/dL)", placeholder: "4.5-12.0", info: "Total Thyroxine" },
  { name: "T4U", label: "T4U", placeholder: "0.7-1.2", info: "T4 Uptake" },
  { name: "FTI", label: "FTI", placeholder: "4.5-12.0", info: "Free Thyroxine Index" },
];

const booleanFields = [
  { name: "on_thyroxine", label: "On Thyroxine", info: "Currently taking thyroxine medication" },
  { name: "query_on_thyroxine", label: "Query on Thyroxine", info: "Questioning thyroxine prescription" },
  { name: "on_antithyroid_medication", label: "On Antithyroid Medication", info: "Currently taking antithyroid drugs" },
  { name: "pregnant", label: "Pregnant", info: "Currently pregnant" },
  { name: "thyroid_surgery", label: "Thyroid Surgery", info: "Previous thyroid surgery" },
  { name: "tumor", label: "Tumor", info: "Presence of thyroid tumor" },
];

export default function ThyroidPage() {
  const [formData, setFormData] = React.useState<Record<string, string | boolean>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<DiagnosisResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Map frontend form data to backend field names
      const payload: ThyroidPayload = {
        age: parseFloat(formData.age as string || "0"),
        on_thyroxine: formData.on_thyroxine ? 1 : 0,
        query_on_thyroxine: formData.query_on_thyroxine ? 1 : 0,
        on_antithyroid_medication: formData.on_antithyroid_medication ? 1 : 0,
        pregnant: formData.pregnant ? 1 : 0,
        thyroid_surgery: formData.thyroid_surgery ? 1 : 0,
        tumor: formData.tumor ? 1 : 0,
        T3: parseFloat(formData.T3 as string || "0"),
        TT4: parseFloat(formData.TT4 as string || "0"),
        T4U: parseFloat(formData.T4U as string || "0"),
        FTI: parseFloat(formData.FTI as string || "0"),
      };

      const apiResult = await diagnoseThyroid(payload);
      setResult(apiResult);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Diagnosis error:", error);
      toast.error("Analysis failed. Please ensure the backend is running.");
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-background to-indigo-500/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium mb-4">
              <Brain className="h-4 w-4" />
              Thyroid Disease Check
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Thyroid Function Analysis
            </h1>
            <p className="text-muted-foreground">
              Comprehensive thyroid assessment using hormone levels and medical history.
              Our Random Forest model achieves 98% accuracy on clinical datasets.
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
                    <Brain className="h-5 w-5 text-purple-500" />
                    Thyroid Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Numeric inputs */}
                    <div>
                      <h3 className="text-sm font-medium mb-4">Hormone Levels</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {numericFields.map((field) => (
                          <div key={field.name} className="space-y-2">
                            <Label htmlFor={field.name} className="flex items-center gap-2">
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
                              value={(formData[field.name] as string) || ""}
                              onChange={handleInputChange}
                              required
                              step="any"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Boolean inputs */}
                    <div>
                      <h3 className="text-sm font-medium mb-4">Medical History</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {booleanFields.map((field) => (
                          <div
                            key={field.name}
                            className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                          >
                            <Label htmlFor={field.name} className="flex items-center gap-2 cursor-pointer">
                              {field.label}
                              <span className="group relative">
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  {field.info}
                                </span>
                              </span>
                            </Label>
                            <Switch
                              id={field.name}
                              checked={!!formData[field.name]}
                              onCheckedChange={(checked) => handleSwitchChange(field.name, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="mr-2 h-5 w-5" />
                          Analyze Thyroid
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
                      <Brain className="h-5 w-5 text-muted-foreground" />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
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

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Probability</span>
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
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your parameters and click Analyze to see results</p>
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
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                About This Assessment
              </h3>
              <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
                This thyroid disease prediction model uses Random Forest classification to analyze
                hormone levels and medical history. It can detect hypothyroidism, hyperthyroidism,
                and other thyroid conditions with 98% accuracy.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-purple-600 border-purple-300">98% Accuracy</Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-300">Random Forest</Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-300">11 Features</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
