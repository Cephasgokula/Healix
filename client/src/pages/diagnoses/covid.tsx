"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scan,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  Upload,
  X,
  ImageIcon,
  FileImage,
  ShieldAlert,
} from "lucide-react";
import { PageLayout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { DiagnosisResult } from "@/types";
import { diagnoseCovid } from "@/lib/api";
import { getRiskColor, getRiskBgColor, validateImageFile } from "@/lib/diagnosis-utils";

export default function CovidPage() {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<DiagnosisResult | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSelectedFile(file);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please upload a chest X-ray image first.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const apiResult = await diagnoseCovid(selectedFile);
      setResult(apiResult);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("COVID-19 diagnosis error:", error);
      toast.error(
        error instanceof Error
          ? `Analysis failed: ${error.message}`
          : "Analysis failed. Please ensure the Flask backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-600 text-sm font-medium mb-4">
              <ShieldAlert className="h-4 w-4" />
              COVID-19 Analysis
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              COVID-19 Chest X-Ray Analysis
            </h1>
            <p className="text-muted-foreground">
              Upload a chest X-ray for AI-powered COVID-19 detection. Our deep learning CNN model
              achieves 90% accuracy in identifying COVID-19 related patterns in chest radiographs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upload & Results Section */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="bg-card border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-red-500" />
                    Chest X-Ray Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Drag & Drop Zone */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => !selectedFile && fileInputRef.current?.click()}
                      className={`
                        relative border-2 border-dashed rounded-xl p-8 text-center
                        transition-all duration-300 cursor-pointer
                        ${isDragOver
                          ? "border-red-500 bg-red-500/5 scale-[1.01]"
                          : selectedFile
                          ? "border-primary/30 bg-primary/5"
                          : "border-border hover:border-red-400 hover:bg-red-500/5"
                        }
                      `}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                        id="covid-xray-upload"
                      />

                      <AnimatePresence mode="wait">
                        {preview ? (
                          <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-4"
                          >
                            <div className="relative inline-block">
                              <img
                                src={preview}
                                alt="Uploaded chest X-ray"
                                className="max-h-72 rounded-lg shadow-md mx-auto object-contain"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearFile();
                                }}
                                className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg hover:bg-destructive/90 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-foreground">
                                {selectedFile?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {selectedFile && (selectedFile.size / 1024).toFixed(1)} KB
                                {" · "}Click or drag to replace
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                          >
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                              <Upload className="h-8 w-8 text-red-500" />
                            </div>
                            <div>
                              <p className="text-lg font-medium text-foreground">
                                Drop your chest X-ray here
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                or click to browse · Supports JPEG, PNG · Max 10 MB
                              </p>
                            </div>
                            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ImageIcon className="h-3.5 w-3.5" /> Chest PA/AP View
                              </span>
                              <span>•</span>
                              <span>High resolution recommended</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* COVID-specific Alert */}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm">
                      <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-200 mb-1">Important Notice</p>
                        <p className="text-red-700 dark:text-red-300">
                          This is a screening tool only. COVID-19 diagnosis must be confirmed with
                          RT-PCR testing. If you are experiencing symptoms, please contact your
                          healthcare provider immediately.
                        </p>
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 text-sm">
                      <Info className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground mb-1">Best Results Tips</p>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Use a standard posteroanterior (PA) or anteroposterior (AP) chest X-ray</li>
                          <li>• Ensure the image is clear, properly oriented, and not cropped</li>
                          <li>• Model looks for ground-glass opacities and bilateral infiltrates typical of COVID-19</li>
                        </ul>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isLoading || !selectedFile}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing X-Ray...
                        </>
                      ) : (
                        <>
                          <Scan className="mr-2 h-5 w-5" />
                          Analyze for COVID-19
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Result Panel */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className={`bg-card border-0 shadow-lg h-full ${result ? getRiskBgColor(result.riskLevel) : ""}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result ? (
                      result.riskLevel === "low" ? (
                        <CheckCircle2 className="h-5 w-5 text-secondary" />
                      ) : (
                        <AlertCircle className={`h-5 w-5 ${getRiskColor(result.riskLevel)}`} />
                      )
                    ) : (
                      <Scan className="h-5 w-5 text-muted-foreground" />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Detection Result */}
                      <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground mb-2">Detection Result</p>
                        <Badge
                          className={`text-lg px-4 py-2 ${
                            result.prediction === 1
                              ? "bg-destructive hover:bg-destructive"
                              : "bg-secondary hover:bg-secondary"
                          }`}
                        >
                          {result.prediction === 1 ? "COVID-19 DETECTED" : "NORMAL"}
                        </Badge>
                      </div>

                      {/* Probability */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className={`font-semibold ${getRiskColor(result.riskLevel)}`}>
                            {result.probability}%
                          </span>
                        </div>
                        <Progress value={result.probability} className="h-3" />
                      </div>

                      {/* Risk Level */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm text-muted-foreground">Risk Level</span>
                        <Badge
                          variant="outline"
                          className={`${getRiskColor(result.riskLevel)} border-current`}
                        >
                          {result.riskLevel.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Recommendation */}
                      <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-sm font-medium mb-2">Recommendation</p>
                        <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                      </div>

                      {/* Next Steps */}
                      <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">
                          Next Steps
                        </p>
                        <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                          {result.prediction === 1 ? (
                            <>
                              <li>• Get a confirmatory RT-PCR test immediately</li>
                              <li>• Self-isolate and inform close contacts</li>
                              <li>• Monitor symptoms (fever, cough, breathing difficulty)</li>
                              <li>• Seek emergency care if breathing becomes difficult</li>
                            </>
                          ) : (
                            <>
                              <li>• Continue following public health guidelines</li>
                              <li>• Monitor for symptoms and test if they develop</li>
                              <li>• This result does not rule out early-stage infection</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Scan className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Upload a chest X-ray and click Analyze to see results</p>
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
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
                <Info className="h-5 w-5" />
                About This Assessment
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                This COVID-19 detection model uses a Convolutional Neural Network (CNN)
                trained on chest X-ray datasets containing COVID-positive, viral pneumonia,
                and normal cases. The model analyzes patterns such as ground-glass opacities,
                consolidation, and bilateral lower-zone predominance typical of COVID-19 infection.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-red-600 border-red-300">90% Accuracy</Badge>
                <Badge variant="outline" className="text-red-600 border-red-300">Deep Learning CNN</Badge>
                <Badge variant="outline" className="text-red-600 border-red-300">64×64 Input</Badge>
                <Badge variant="outline" className="text-red-600 border-red-300">Binary Classification</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageLayout>
  );
}
