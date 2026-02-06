/**
 * AI-based Medical Urgency Analyzer
 * Node.js wrapper to call Python AI analysis
 */

const { spawn } = require('child_process');
const path = require('path');

/**
 * Analyze medical urgency using AI
 * @param {string} transcript - Patient's audio transcript
 * @returns {Promise<object>} - Urgency analysis result
 */
async function analyzeUrgencyWithAI(transcript) {
    return new Promise((resolve, reject) => {
        // Path to Python script
        const pythonScript = path.join(__dirname, 'aiAnalysis.py');
        
        // Use the virtual environment Python
        const pythonPath = path.join(__dirname, '..', 'venv', 'bin', 'python');
        
        // Spawn Python process
        const pythonProcess = spawn(pythonPath, [pythonScript, transcript]);
        
        let dataString = '';
        let errorString = '';
        
        // Collect data from stdout
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });
        
        // Collect errors from stderr
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });
        
        // Handle process completion
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error('Python AI analysis error:', errorString);
                // Fallback to hardcoded analysis
                resolve(fallbackAnalysis(transcript));
            } else {
                try {
                    const result = JSON.parse(dataString);
                    resolve(result);
                } catch (error) {
                    console.error('Error parsing AI result:', error);
                    resolve(fallbackAnalysis(transcript));
                }
            }
        });
        
        // Handle process errors
        pythonProcess.on('error', (error) => {
            console.error('Failed to start Python process:', error);
            resolve(fallbackAnalysis(transcript));
        });
    });
}

/**
 * Fallback analysis using hardcoded keyword matching
 * @param {string} transcript - Patient's audio transcript
 * @returns {object} - Urgency analysis result
 */
function fallbackAnalysis(transcript) {
    const lowerTranscript = transcript.toLowerCase();
    
    // Emergency keywords
    const emergencyKeywords = [
        'emergency', 'urgent', 'critical', 'dying', 'help me',
        'heart attack', 'stroke', 'can\'t breathe', 'chest pain',
        'severe bleeding', 'unconscious', 'seizure', 'collapsed'
    ];
    
    // High priority keywords
    const highPriorityKeywords = [
        'severe', 'extreme', 'intense', 'unbearable', 'excruciating',
        'broken', 'fracture', 'accident', 'injury', 'blood', 'vomiting blood'
    ];
    
    // Medium priority keywords
    const mediumPriorityKeywords = [
        'pain', 'hurt', 'ache', 'sick', 'fever', 'cough',
        'nausea', 'vomiting', 'dizzy', 'weak', 'tired'
    ];
    
    // Count keyword matches
    const emergencyCount = emergencyKeywords.filter(keyword => 
        lowerTranscript.includes(keyword)
    ).length;
    
    const highCount = highPriorityKeywords.filter(keyword => 
        lowerTranscript.includes(keyword)
    ).length;
    
    const mediumCount = mediumPriorityKeywords.filter(keyword => 
        lowerTranscript.includes(keyword)
    ).length;
    
    // Calculate urgency score
    let urgencyScore = 0;
    let urgencyRank = 3;
    let severity = 'low';
    let detectedKeywords = [];
    
    if (emergencyCount > 0) {
        urgencyScore = Math.min(8 + emergencyCount * 0.5, 10);
        urgencyRank = 1;
        severity = 'critical';
        detectedKeywords = emergencyKeywords.filter(k => lowerTranscript.includes(k));
    } else if (highCount > 0) {
        urgencyScore = Math.min(5 + highCount * 0.5, 8);
        urgencyRank = 2;
        severity = 'high';
        detectedKeywords = highPriorityKeywords.filter(k => lowerTranscript.includes(k));
    } else if (mediumCount > 0) {
        urgencyScore = Math.min(2 + mediumCount * 0.3, 5);
        urgencyRank = 2;
        severity = 'medium';
        detectedKeywords = mediumPriorityKeywords.filter(k => lowerTranscript.includes(k));
    } else {
        urgencyScore = 1;
        urgencyRank = 3;
        severity = 'low';
    }
    
    // Generate recommendation
    let recommendation;
    if (urgencyScore >= 8) {
        recommendation = "CALL 911 IMMEDIATELY - This requires emergency medical attention";
    } else if (urgencyScore >= 6) {
        recommendation = "Seek urgent care immediately - Visit emergency room or urgent care clinic";
    } else if (urgencyScore >= 4) {
        recommendation = "Schedule medical consultation soon - Contact your doctor within 24-48 hours";
    } else if (urgencyScore >= 2) {
        recommendation = "Monitor symptoms - Schedule routine appointment if symptoms persist";
    } else {
        recommendation = "General health inquiry - No immediate medical attention required";
    }
    
    return {
        urgencyScore: Math.round(urgencyScore * 100) / 100,
        urgencyRank: urgencyRank,
        severity: severity,
        detectedSymptoms: detectedKeywords.map(k => ({ symptom: k, severity: severity })),
        detectedKeywords: detectedKeywords,
        recommendation: recommendation,
        confidence: 50,
        aiClassification: 'Fallback keyword-based analysis',
        method: 'fallback'
    };
}

module.exports = {
    analyzeUrgencyWithAI,
    fallbackAnalysis
};