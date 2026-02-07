// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  jwt: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// Audio Recording types
export interface AudioRecording {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  transcript: string;
  audioUrl: string;
  createdAt: string;
  analysis?: UrgencyAnalysis;
}

export interface UrgencyAnalysis {
  urgencyScore: number;
  urgencyRank: 1 | 2 | 3;
  severityLevel: "critical" | "high" | "medium" | "low" | "minimal";
  detectedSymptoms: string[];
  recommendation: string;
  confidence: number;
}

// Diagnosis types
export interface DiabetesInput {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

export interface ThyroidInput {
  age: number;
  on_thyroxine: boolean;
  query_on_thyroxine: boolean;
  on_antithyroid_medication: boolean;
  pregnant: boolean;
  thyroid_surgery: boolean;
  tumor: boolean;
  T3: number;
  TT4: number;
  T4U: number;
  FTI: number;
}

export interface BreastCancerInput {
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

export interface DiagnosisResult {
  prediction: number;
  probability: number;
  riskLevel: "low" | "medium" | "high";
  recommendation: string;
}

// Hospital/Doctor types
export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  rating: number;
  location: string;
  image?: string;
  contact: string;
  hospital: string;
  experience: number;
  available: boolean;
}

// Emergency Ranking types
export interface EmergencyPatient {
  _id: string;
  name: string;
  symptoms: string;
  urgencyScore: number;
  urgencyLevel: "critical" | "high" | "medium" | "low";
  createdAt: string;
  status: "pending" | "in-progress" | "resolved";
}

// API Response types
export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  status: "success";
  results: number;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalResults: number;
  };
}

// Testimonial type
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  review: string;
}

// Service Card type
export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
}
