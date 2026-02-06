const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const stream = require('stream');
const { GridFSBucket, ObjectId } = require('mongodb');
const userRoutes = require('./Routes/userRoutes');
const AudioUpload = require('./Models/AudioUpload');
const fs = require('fs');
require('dotenv').config({ path: './config.env' });

// Import AI-based urgency analyzer
const { analyzeUrgencyWithAI, fallbackAnalysis } = require('./AI_Urgency/urgencyAnalyzer');

const app = express();
const PORT = 3000;
const DB = process.env.DATABASE;

app.use(cors());
app.use(express.json());

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  let gfsBucket;
  mongoose.connection.once('open', () => {
    gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'audioFiles' });
    console.log('GridFS bucket initialized');
  });
  
  const storage = multer.memoryStorage();
  const upload = multer({ storage });
  
  // ============================================================
  // CONFIGURATION TOGGLES
  // ============================================================
  // Toggle between AI and hardcoded analysis
  const USE_AI_ANALYSIS = true; // Set to false to use hardcoded keyword matching
  
  // ============================================================
  // OLD HARDCODED SENTIMENT ANALYSIS (COMMENTED - KEPT AS BACKUP)
  // ============================================================
  /*
  // Simple sentiment analysis function for emergency detection
  function analyzeEmergencySentiment(text) {
    const lowerText = text.toLowerCase();
    console.log(lowerText, "in 35");
    // Emergency keywords with weights
    const emergencyKeywords = {
      'emergency': 10,
      'urgent': 9,
      'immediate': 8,
      'help': 7,
      'pain': 6,
      'critical': 9,
      'severe': 8,
      'dying': 10,
      'heart attack': 10,
      'stroke': 10,
      'bleeding': 8,
      'unconscious': 9,
      'can\'t breathe': 9,
      'chest pain': 8,
      'broken': 7,
      'accident': 7,
      'trauma': 8,
      'serious': 7,
      'bad': 5,
      'terrible': 6,
      'awful': 6,
      'worst': 7
    };
    
    let totalScore = 0;
    let keywordCount = 0;
    
    for (const [keyword, weight] of Object.entries(emergencyKeywords)) {
      if (lowerText.includes(keyword)) {
        totalScore += weight;
        keywordCount++;
      }
    }
    
    // Calculate urgency score (0-10 scale)
    const urgencyScore = keywordCount > 0 ? Math.min(totalScore / keywordCount, 10) : 0;
    
    // Determine urgency rank
    let urgencyRank;
    if (urgencyScore >= 8) urgencyRank = 1; // Highly urgent
    else if (urgencyScore >= 5) urgencyRank = 2; // Medium urgent
    else urgencyRank = 3; // Low urgent
    
    return {
      urgencyScore,
      urgencyRank,
      keywordCount,
      detectedKeywords: Object.keys(emergencyKeywords).filter(keyword => lowerText.includes(keyword))
    };
  }
  */
  // ============================================================
  // END OF OLD HARDCODED ANALYSIS
  // ============================================================
  
  // Upload audio endpoint
  app.post('/upload-audio', upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  
      const { name, email, transcript } = req.body; // transcript will come from frontend
      
      // Debug logging
      console.log('========================================');
      console.log('📤 AUDIO UPLOAD REQUEST RECEIVED');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Transcript:', transcript);
      console.log('Transcript length:', transcript ? transcript.length : 0);
      console.log('File size:', req.file.size, 'bytes');
      console.log('========================================');
      
      if (!name || !email) return res.status(400).json({ message: 'Name and Email required' });
  
      const filename = `audio_${Date.now()}.webm`;
  
      // Save audio buffer to GridFS
      const readableStream = new stream.Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null);
  
      const uploadStream = gfsBucket.openUploadStream(filename, {
        contentType: 'audio/webm',
        metadata: { name, email }
      });
  
      readableStream.pipe(uploadStream)
        .on('error', (err) => {
          console.error('Error uploading to GridFS:', err);
          return res.status(500).json({ message: 'GridFS upload error' });
        })
        .on('finish', async () => {
          console.log(`Saved audio to GridFS with ID: ${uploadStream.id}`);
          
          // ============================================================
          // NEW AI-BASED URGENCY ANALYSIS
          // ============================================================
          let analysisResult;
          
          if (transcript) {
            if (USE_AI_ANALYSIS) {
              console.log('🤖 Using AI-based urgency analysis...');
              try {
                // Use AI-based analysis
                analysisResult = await analyzeUrgencyWithAI(transcript);
                console.log('✅ AI Analysis Result:', analysisResult);
              } catch (error) {
                console.error('❌ AI analysis failed, using fallback:', error);
                analysisResult = fallbackAnalysis(transcript);
              }
            } else {
              console.log('📝 Using hardcoded keyword matching (fallback mode)');
              analysisResult = fallbackAnalysis(transcript);
            }
            
            console.log('Transcript:', transcript);
            console.log('Urgency Analysis:', analysisResult);
          } else {
            // No transcript provided
            analysisResult = {
              urgencyScore: 0,
              urgencyRank: 3,
              severity: 'none',
              detectedSymptoms: [],
              detectedKeywords: [],
              recommendation: 'No transcript provided',
              confidence: 0
            };
          }
          
          // Save to AudioUpload collection with enhanced data
          await AudioUpload.create({
            name,
            email,
            fileId: uploadStream.id,
            transcript: transcript || '',
            sentimentScore: analysisResult.urgencyScore,
            urgencyRank: analysisResult.urgencyRank,
            aiAnalysis: {
              severity: analysisResult.severity,
              detectedSymptoms: analysisResult.detectedSymptoms,
              recommendation: analysisResult.recommendation,
              confidence: analysisResult.confidence,
              aiClassification: analysisResult.aiClassification || 'N/A'
            }
          });
          
          return res.status(200).json({
            message: 'Audio uploaded and analyzed successfully',
            fileId: uploadStream.id.toString(),
            transcript: transcript || '',
            urgencyScore: analysisResult.urgencyScore,
            urgencyRank: analysisResult.urgencyRank,
            severity: analysisResult.severity,
            detectedSymptoms: analysisResult.detectedSymptoms,
            detectedKeywords: analysisResult.detectedKeywords || [],
            recommendation: analysisResult.recommendation,
            confidence: analysisResult.confidence,
            analysisMethod: USE_AI_ANALYSIS ? 'AI-based' : 'Keyword-based'
          });
        });
  
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
 // List all audios with metadata
 // Fetches from AudioUpload collection (has full AI analysis data)
 app.get('/audios', async (req, res) => {
  console.log('Received request to /audios');

  try {
    // Fetch ALL audio records, sorted by most recent first
    const audioRecords = await AudioUpload.find({}).sort({ createdAt: -1 });
    console.log(`📊 Found ${audioRecords.length} audio records`);

    if (!audioRecords || audioRecords.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    // Map to include all necessary data
    const audios = audioRecords.map(record => ({
      id: record.fileId.toString(),
      fileId: record.fileId.toString(),
      name: record.name,
      email: record.email,
      transcript: record.transcript,
      sentimentScore: record.sentimentScore,
      urgencyRank: record.urgencyRank,
      uploadDate: record.createdAt,
      aiAnalysis: record.aiAnalysis
    }));

    return res.status(200).json(audios);
  } catch (err) {
    console.error('Error fetching audios:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});




app.get('/audio/:id', async (req, res) => {
  const idstr = req.params.id;

  // Validate id before creating ObjectId
  if (!ObjectId.isValid(idstr) || (String)(new ObjectId(idstr)) !== idstr) {
    return res.status(400).json({ message: 'Invalid audio ID' });
  }

  const fileId = new ObjectId(idstr);

  try {
    const files = await gfsBucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Audio not found' });
    }
    const file = files[0];

    const range = req.headers.range;
    const fileSize = file.length;
    const contentType = file.contentType || 'audio/mpeg';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
      }

      const chunkSize = end - start + 1;

      res.status(206);
      res.set({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });

      const downloadStream = gfsBucket.openDownloadStream(fileId, { start, end: end + 1 });
      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error streaming audio with range:', err);
        res.status(500).end();
      });

    } else {
      res.status(200);
      res.set({
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      });

      const downloadStream = gfsBucket.openDownloadStream(fileId);
      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error streaming audio:', err);
        res.status(500).end();
      });
    }
  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).json({ message: 'Error streaming audio' });
  }
});




app.use('/', userRoutes);

// Endpoint to get current server configuration
app.get('/api/config', (req, res) => {
  res.json({
    useAiAnalysis: USE_AI_ANALYSIS,
    useNewDataMode: USE_NEW_DATA_MODE,
    newDataStartDate: NEW_DATA_START_DATE,
    message: USE_NEW_DATA_MODE 
      ? '📊 Using NEW data mode - Real voice recordings from today onwards' 
      : '📦 Using OLD data mode - Backup test recordings'
  });
});

// Endpoint to get audios/users ranked by urgency (most urgent first, then by score, then by time)
app.get('/emergency-ranking', async (req, res) => {
  try {
    // Fetch ALL audio records, sorted by urgency rank (1=HIGH first), then score, then most recent
    const ranked = await AudioUpload.find({}).sort({ urgencyRank: 1, sentimentScore: -1, createdAt: -1 });
    
    console.log(`📊 Found ${ranked.length} audio records for emergency ranking`);
    res.status(200).json(ranked);
  } catch (err) {
    console.error('Error fetching emergency ranking:', err);
    res.status(500).json({ message: 'Error fetching emergency ranking' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});