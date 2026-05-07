/**
 * API Client for Healix backend services
 * - Node.js (Express): Port 3001 - Audio uploads, emergency ranking, auth
 * - Flask (Python): Port 5000 - ML diagnosis endpoints
 */

import axios from "axios";
import type { DiagnosisResult, EmergencyPatient } from "@/types";

// Base URLs for backend services (never hardcoded — driven by .env)
const NODE_API_URL = process.env.NEXT_PUBLIC_NODE_API_URL || "http://localhost:3001";
const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL || "http://localhost:5000";

// Create axios instances
export const nodeApi = axios.create({
  baseURL: NODE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const flaskApi = axios.create({
  baseURL: FLASK_API_URL,
  headers: { "Content-Type": "application/json" },
});

// ============================================
// Flask ML Diagnosis APIs
// ============================================

// Diagnosis type identifiers — used for recommendation lookup
type DiagnosisType = "diabetes" | "thyroid" | "breast-cancer" | "pneumonia" | "covid";

interface DiabetesPayload {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

interface ThyroidPayload {
  age: number;
  on_thyroxine: number;
  query_on_thyroxine: number;
  on_antithyroid_medication: number;
  pregnant: number;
  thyroid_surgery: number;
  tumor: number;
  T3: number;
  TT4: number;
  T4U: number;
  FTI: number;
}

interface BreastCancerPayload {
  radius_mean: number;
  texture_mean: number;
  perimeter_mean: number;
  area_mean: number;
  smoothness_mean: number;
  compactness_mean: number;
  concavity_mean: number;
  concave_points_mean: number;
  radius_worst: number;
  texture_worst: number;
  perimeter_worst: number;
  area_worst: number;
  smoothness_worst: number;
  compactness_worst: number;
  concavity_worst: number;
  concave_points_worst: number;
}

interface FlaskDiagnosisResponse {
  status: string;
  probability: string;
  error?: string;
}

// ---- Shared response mapper (DRY) ----

/**
 * Converts a raw Flask probability string into a structured DiagnosisResult.
 * Centralises the risk-level thresholds and rounding so every diagnosis
 * endpoint behaves identically.
 */
function mapFlaskResponse(
  response: FlaskDiagnosisResponse,
  type: DiagnosisType,
): DiagnosisResult {
  if (response.error) {
    throw new Error(response.error);
  }

  const raw = parseFloat(response.probability);
  if (isNaN(raw)) {
    throw new Error("Invalid probability value received from server");
  }

  const probability = Math.round(raw * 1000) / 10; // 0-100, one decimal

  return {
    prediction: probability > 50 ? 1 : 0,
    probability,
    riskLevel: probability > 70 ? "high" : probability > 40 ? "medium" : "low",
    recommendation: getRecommendation(type, probability),
  };
}

// ---- Parameter-based endpoints ----

/** Diabetes prediction */
export async function diagnoseDiabetes(data: DiabetesPayload): Promise<DiagnosisResult> {
  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Diabetes", data);
  return mapFlaskResponse(response.data, "diabetes");
}

/** Thyroid prediction */
export async function diagnoseThyroid(data: ThyroidPayload): Promise<DiagnosisResult> {
  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Thyroid", data);
  return mapFlaskResponse(response.data, "thyroid");
}

/** Breast cancer prediction */
export async function diagnoseBreastCancer(data: BreastCancerPayload): Promise<DiagnosisResult> {
  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Breast_Cancer", data);
  return mapFlaskResponse(response.data, "breast-cancer");
}

// ---- Image-based endpoints ----

/** Pneumonia detection (image-based) */
export async function diagnosePneumonia(imageFile: File): Promise<DiagnosisResult> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Pneumonia", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return mapFlaskResponse(response.data, "pneumonia");
}

/** COVID-19 detection (image-based) */
export async function diagnoseCovid(imageFile: File): Promise<DiagnosisResult> {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Covid", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return mapFlaskResponse(response.data, "covid");
}

// ============================================
// Node.js Audio/Emergency APIs
// ============================================

interface AudioUploadData {
  name: string;
  email: string;
  audioBlob: Blob;
  transcript: string;
}

interface AudioUploadResponse {
  message: string;
  fileId: string;
  transcript: string;
  urgencyScore: number;
  urgencyRank: number;
  severity: string;
  detectedSymptoms: string[];
  recommendation: string;
  confidence: number;
}

/** Upload audio recording with transcript */
export async function uploadAudio(data: AudioUploadData): Promise<AudioUploadResponse> {
  const formData = new FormData();
  formData.append("audio", data.audioBlob, "recording.webm");
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("transcript", data.transcript);

  const response = await nodeApi.post<AudioUploadResponse>("/upload-audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  
  return response.data;
}

/** Get emergency patient ranking */
export async function getEmergencyRanking(): Promise<EmergencyPatient[]> {
  const response = await nodeApi.get("/emergency-ranking");
  
  // Transform backend response to frontend type
  return response.data.map((record: Record<string, unknown>) => ({
    _id: String(record._id || record.fileId),
    name: String(record.name || "Anonymous"),
    symptoms: String(record.transcript || ""),
    urgencyScore: Number(record.sentimentScore || 0),
    urgencyLevel: getUrgencyLevel(Number(record.urgencyRank || 3)),
    createdAt: String(record.createdAt || new Date().toISOString()),
    status: "pending" as const,
  }));
}

// ============================================
// Helper functions
// ============================================

function getUrgencyLevel(rank: number): "critical" | "high" | "medium" | "low" {
  switch (rank) {
    case 1: return "critical";
    case 2: return "high";
    case 3: return "medium";
    default: return "low";
  }
}

/** Recommendation text keyed by diagnosis type + probability band. */
const RECOMMENDATIONS: Record<DiagnosisType, { high: string; medium: string; low: string }> = {
  diabetes: {
    high: "High risk detected. Please consult a healthcare provider immediately for proper testing.",
    medium: "Moderate risk. Consider lifestyle changes and regular monitoring. Consult your doctor.",
    low: "Low risk. Maintain a healthy lifestyle with regular exercise and balanced diet.",
  },
  thyroid: {
    high: "Thyroid dysfunction detected. Please consult an endocrinologist for comprehensive thyroid panel testing.",
    medium: "Some indicators suggest possible thyroid irregularity. Consider follow-up testing.",
    low: "Thyroid function appears normal. Continue regular health checkups.",
  },
  "breast-cancer": {
    high: "Analysis suggests potential malignancy. Please consult an oncologist immediately for further testing (biopsy, imaging).",
    medium: "Some indicators warrant attention. Schedule a follow-up with your healthcare provider for additional screening.",
    low: "Results appear benign. Continue with regular breast health screenings as recommended.",
  },
  pneumonia: {
    high: "High probability of pneumonia detected. Seek immediate medical attention — a pulmonologist or ER visit is recommended.",
    medium: "Moderate indicators present. Consult a healthcare provider for a thorough lung examination and possible follow-up X-ray.",
    low: "Low probability of pneumonia. Your chest X-ray appears normal. Continue regular health monitoring.",
  },
  covid: {
    high: "High probability of COVID-19 detected. Please isolate immediately and seek medical attention. Get a confirmatory PCR test.",
    medium: "Some indicators suggest possible COVID-19 infection. Get a PCR test and monitor symptoms closely. Consider self-isolation.",
    low: "Low probability of COVID-19. Your chest X-ray appears normal. Continue following safety protocols and monitoring symptoms.",
  },
};

function getRecommendation(type: DiagnosisType, probability: number): string {
  const band = probability > 70 ? "high" : probability > 40 ? "medium" : "low";
  return RECOMMENDATIONS[type]?.[band] ?? "Please consult a healthcare provider for further evaluation.";
}

// Export payload types for use in components
export type { DiabetesPayload, ThyroidPayload, BreastCancerPayload };
