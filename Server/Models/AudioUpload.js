const mongoose = require("mongoose");

const audioUploadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
  transcript: { type: String },
  sentimentScore: { type: Number },
  urgencyRank: { type: Number },
  // AI Analysis data (new fields for real AI integration)
  aiAnalysis: {
    severity: { type: String }, // 'critical', 'high', 'medium', 'low', 'minimal'
    detectedSymptoms: [
      {
        symptom: { type: String },
        severity: { type: String }
      }
    ],
    recommendation: { type: String },
    confidence: { type: Number }, // 0-100 percentage
    aiClassification: { type: String } // The AI's classification text
  },
  createdAt: { type: Date, default: Date.now }
});

const AudioUpload = mongoose.model("AudioUpload", audioUploadSchema);

module.exports = AudioUpload;