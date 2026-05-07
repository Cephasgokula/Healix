/**
 * seed-uploads.js
 *
 * Seeds the running Node.js server (port 3001) with all .webm files
 * found in the ./uploads directory, so they show up in the admin
 * Audio Recordings page.
 *
 * Usage: node seed-uploads.js
 *
 * Requirements:
 *   - Node.js server must be running on port 3001
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const SERVER_URL = 'http://localhost:3001';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Sample transcripts to make the data realistic and trigger the urgency AI
const SAMPLE_TRANSCRIPTS = [
  "I have severe chest pain radiating to my left arm. I can't breathe properly and I feel dizzy.",
  "I'm experiencing a high fever of 104 degrees and difficulty breathing. Please help me.",
  "I have a mild headache and slight cough. I think I might have a cold.",
  "My blood pressure is very high and I'm feeling extremely anxious and short of breath.",
  "I twisted my ankle while walking. It's a bit swollen but I can still walk on it.",
  "I'm having a severe allergic reaction. My throat is swelling and I can't swallow.",
  "I've had a persistent cough for the past two weeks. No fever but feeling tired.",
  "I feel a sharp pain in my abdomen on the right side. It started suddenly.",
  "I have a minor cut on my hand from cooking. It's bleeding a little.",
  "I'm experiencing numbness in my left arm and slurred speech. I think I'm having a stroke.",
  "I have moderate back pain for the last three days. It gets worse when I sit.",
  "My child has a fever of 101 and has been vomiting. I'm worried.",
  "I feel very weak and faint. I haven't eaten anything since yesterday.",
  "I accidentally took double my medication dose. I'm feeling nauseous.",
];

const SAMPLE_PATIENTS = [
  { name: 'Arjun Mehta',    email: 'arjun.mehta@example.com' },
  { name: 'Priya Sharma',   email: 'priya.sharma@example.com' },
  { name: 'Rahul Verma',    email: 'rahul.verma@example.com' },
  { name: 'Sneha Iyer',     email: 'sneha.iyer@example.com' },
  { name: 'Kiran Patel',    email: 'kiran.patel@example.com' },
  { name: 'Divya Nair',     email: 'divya.nair@example.com' },
  { name: 'Vijay Kumar',    email: 'vijay.kumar@example.com' },
  { name: 'Ananya Singh',   email: 'ananya.singh@example.com' },
  { name: 'Rohan Das',      email: 'rohan.das@example.com' },
  { name: 'Lakshmi Reddy',  email: 'lakshmi.reddy@example.com' },
  { name: 'Aditya Gupta',   email: 'aditya.gupta@example.com' },
  { name: 'Meera Joshi',    email: 'meera.joshi@example.com' },
  { name: 'Sanjay Bose',    email: 'sanjay.bose@example.com' },
  { name: 'Tanvi Desai',    email: 'tanvi.desai@example.com' },
];

async function uploadFile(filePath, patient, transcript) {
  const form = new FormData();
  form.append('audio', fs.createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: 'audio/webm',
  });
  form.append('name', patient.name);
  form.append('email', patient.email);
  form.append('transcript', transcript);

  const response = await axios.post(`${SERVER_URL}/upload-audio`, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  return response.data;
}

async function main() {
  // Get all .webm files from uploads/
  const files = fs.readdirSync(UPLOADS_DIR)
    .filter(f => f.endsWith('.webm'))
    .map(f => path.join(UPLOADS_DIR, f));

  if (files.length === 0) {
    console.log('❌ No .webm files found in ./uploads');
    process.exit(1);
  }

  console.log(`📂 Found ${files.length} audio file(s) in ./uploads`);
  console.log(`🌐 Posting to ${SERVER_URL}/upload-audio\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const patient = SAMPLE_PATIENTS[i % SAMPLE_PATIENTS.length];
    const transcript = SAMPLE_TRANSCRIPTS[i % SAMPLE_TRANSCRIPTS.length];

    process.stdout.write(`[${i + 1}/${files.length}] Uploading ${path.basename(filePath)} as "${patient.name}"... `);

    try {
      const result = await uploadFile(filePath, patient, transcript);
      console.log(`✅  Urgency: ${result.severity} (rank ${result.urgencyRank}, score ${result.urgencyScore})`);
      successCount++;
    } catch (err) {
      console.log(`❌  Failed: ${err.message}`);
      failCount++;
    }

    // Small delay to avoid overwhelming the AI analysis calls
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n🎉 Done — ${successCount} uploaded, ${failCount} failed`);
  console.log(`👉 Open http://localhost:3000/admin/audio to see the recordings`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
