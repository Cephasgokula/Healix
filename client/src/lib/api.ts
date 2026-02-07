/**
 * API Client for Healix backend services
 * - Node.js (Express): Port 3001 - Audio uploads, emergency ranking, auth
 * - Flask (Python): Port 5000 - ML diagnosis endpoints
 */

import axios from "axios";
import type { DiagnosisResult, EmergencyPatient } from "@/types";

// Base URLs for backend services
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

/**
 * Diabetes prediction
 */
export async function diagnoseDiabetes(data: DiabetesPayload): Promise<DiagnosisResult> {
  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Diabetes", data);
  const probability = parseFloat(response.data.probability) * 100;
  
  return {
    prediction: probability > 50 ? 1 : 0,
    probability: Math.round(probability * 10) / 10,
    riskLevel: probability > 70 ? "high" : probability > 40 ? "medium" : "low",
    recommendation: getRecommendation("diabetes", probability),
  };
}

/**
 * Thyroid prediction
 */
export async function diagnoseThyroid(data: ThyroidPayload): Promise<DiagnosisResult> {
  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Thyroid", data);
  const probability = parseFloat(response.data.probability) * 100;
  
  return {
    prediction: probability > 50 ? 1 : 0,
    probability: Math.round(probability * 10) / 10,
    riskLevel: probability > 70 ? "high" : probability > 40 ? "medium" : "low",
    recommendation: getRecommendation("thyroid", probability),
  };
}

/**
 * Breast cancer prediction
 */
export async function diagnoseBreastCancer(data: BreastCancerPayload): Promise<DiagnosisResult> {
  const response = await flaskApi.post<FlaskDiagnosisResponse>("/diagnose_Breast_Cancer", data);
  const probability = parseFloat(response.data.probability) * 100;
  
  return {
    prediction: probability > 50 ? 1 : 0,
    probability: Math.round(probability * 10) / 10,
    riskLevel: probability > 70 ? "high" : probability > 40 ? "medium" : "low",
    recommendation: getRecommendation("breast-cancer", probability),
  };
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

/**
 * Upload audio recording with transcript
 */
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

/**
 * Get emergency patient ranking
 */
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

function getRecommendation(type: string, probability: number): string {
  if (probability > 70) {
    switch (type) {
      case "diabetes":
        return "High risk detected. Please consult a healthcare provider immediately for proper testing.";
      case "thyroid":
        return "Thyroid dysfunction detected. Please consult an endocrinologist for comprehensive thyroid panel testing.";
      case "breast-cancer":
        return "Analysis suggests potential malignancy. Please consult an oncologist immediately for further testing (biopsy, imaging).";
      default:
        return "High risk detected. Please consult a healthcare provider immediately.";
    }
  } else if (probability > 40) {
    switch (type) {
      case "diabetes":
        return "Moderate risk. Consider lifestyle changes and regular monitoring. Consult your doctor.";
      case "thyroid":
        return "Some indicators suggest possible thyroid irregularity. Consider follow-up testing.";
      case "breast-cancer":
        return "Some indicators warrant attention. Schedule a follow-up with your healthcare provider for additional screening.";
      default:
        return "Moderate risk. Consider consulting your healthcare provider.";
    }
  } else {
    switch (type) {
      case "diabetes":
        return "Low risk. Maintain a healthy lifestyle with regular exercise and balanced diet.";
      case "thyroid":
        return "Thyroid function appears normal. Continue regular health checkups.";
      case "breast-cancer":
        return "Results appear benign. Continue with regular breast health screenings as recommended.";
      default:
        return "Low risk. Continue with regular health checkups.";
    }
  }
}

// Export payload types for use in components
export type { DiabetesPayload, ThyroidPayload, BreastCancerPayload };
