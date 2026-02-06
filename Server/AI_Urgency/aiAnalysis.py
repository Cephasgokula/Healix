"""
AI-based Medical Urgency Analyzer
Uses transformer models to analyze patient symptoms and determine urgency
"""

from transformers import pipeline
import json
import sys
import re

class MedicalUrgencyAnalyzer:
    def __init__(self):
        """Initialize the AI model for text classification"""
        try:
            # Using a general text classification model
            # You can replace this with a medical-specific model if available
            self.classifier = pipeline("zero-shot-classification", 
                                      model="facebook/bart-large-mnli")
        except Exception as e:
            print(f"Error loading model: {e}", file=sys.stderr)
            self.classifier = None
    
    def analyze_urgency(self, transcript):
        """
        Analyze medical urgency from patient transcript
        Returns urgency score (0-10) and detected symptoms
        """
        if not transcript or len(transcript.strip()) == 0:
            return {
                'urgencyScore': 0,
                'urgencyRank': 3,
                'severity': 'low',
                'detectedSymptoms': [],
                'recommendation': 'No symptoms described',
                'confidence': 0
            }
        
        # Define urgency categories
        urgency_labels = [
            "life-threatening emergency requiring immediate medical attention",
            "serious medical condition requiring urgent care",
            "moderate health concern requiring medical consultation",
            "mild symptoms that can wait for routine care",
            "general health inquiry or non-urgent matter"
        ]
        
        try:
            # Classify the urgency level
            result = self.classifier(transcript, urgency_labels)
            
            # Get the top prediction
            top_label = result['labels'][0]
            confidence = result['scores'][0]
            
            # Map to urgency score (0-10)
            if "life-threatening" in top_label:
                urgency_score = 9 + (confidence * 1)  # 9-10
                urgency_rank = 1
                severity = "critical"
            elif "serious medical" in top_label:
                urgency_score = 7 + (confidence * 2)  # 7-9
                urgency_rank = 1
                severity = "high"
            elif "moderate health" in top_label:
                urgency_score = 4 + (confidence * 3)  # 4-7
                urgency_rank = 2
                severity = "medium"
            elif "mild symptoms" in top_label:
                urgency_score = 1 + (confidence * 3)  # 1-4
                urgency_rank = 3
                severity = "low"
            else:
                urgency_score = 0 + (confidence * 1)  # 0-1
                urgency_rank = 3
                severity = "minimal"
            
            # Detect specific medical keywords
            detected_symptoms = self._detect_symptoms(transcript)
            
            # Generate recommendation
            recommendation = self._generate_recommendation(urgency_score, detected_symptoms)
            
            return {
                'urgencyScore': round(urgency_score, 2),
                'urgencyRank': urgency_rank,
                'severity': severity,
                'detectedSymptoms': detected_symptoms,
                'recommendation': recommendation,
                'confidence': round(confidence * 100, 2),
                'aiClassification': top_label
            }
            
        except Exception as e:
            print(f"Error in AI analysis: {e}", file=sys.stderr)
            # Fallback to keyword-based analysis
            return self._fallback_analysis(transcript)
    
    def _detect_symptoms(self, transcript):
        """Detect medical symptoms from transcript"""
        transcript_lower = transcript.lower()
        
        # Critical symptoms
        critical_symptoms = {
            'chest pain': ['chest pain', 'chest pressure', 'crushing chest', 'heart pain'],
            'breathing difficulty': ['can\'t breathe', 'difficulty breathing', 'shortness of breath', 'gasping'],
            'stroke symptoms': ['stroke', 'paralysis', 'face drooping', 'arm weakness', 'slurred speech'],
            'severe bleeding': ['severe bleeding', 'heavy bleeding', 'blood loss', 'hemorrhage'],
            'unconscious': ['unconscious', 'passed out', 'fainting', 'collapsed'],
            'heart attack': ['heart attack', 'cardiac arrest', 'heart stopped'],
            'seizure': ['seizure', 'convulsion', 'epileptic']
        }
        
        # Serious symptoms
        serious_symptoms = {
            'severe pain': ['severe pain', 'excruciating', 'unbearable pain', 'intense pain'],
            'high fever': ['high fever', 'burning up', 'very hot', 'temperature'],
            'vomiting blood': ['vomiting blood', 'blood in vomit', 'throwing up blood'],
            'head injury': ['head injury', 'hit my head', 'head trauma', 'concussion'],
            'broken bone': ['broken bone', 'fracture', 'snapped', 'bone broke']
        }
        
        # Moderate symptoms
        moderate_symptoms = {
            'pain': ['pain', 'hurts', 'ache', 'sore'],
            'fever': ['fever', 'temperature', 'chills'],
            'cough': ['cough', 'coughing'],
            'nausea': ['nausea', 'sick', 'queasy'],
            'headache': ['headache', 'head hurts', 'migraine']
        }
        
        detected = []
        
        # Check critical first
        for symptom, keywords in critical_symptoms.items():
            if any(keyword in transcript_lower for keyword in keywords):
                detected.append({'symptom': symptom, 'severity': 'critical'})
        
        # Check serious
        for symptom, keywords in serious_symptoms.items():
            if any(keyword in transcript_lower for keyword in keywords):
                detected.append({'symptom': symptom, 'severity': 'serious'})
        
        # Check moderate
        for symptom, keywords in moderate_symptoms.items():
            if any(keyword in transcript_lower for keyword in keywords):
                if not any(d['symptom'] == symptom for d in detected):  # Avoid duplicates
                    detected.append({'symptom': symptom, 'severity': 'moderate'})
        
        return detected
    
    def _generate_recommendation(self, urgency_score, symptoms):
        """Generate medical recommendation based on urgency"""
        if urgency_score >= 8:
            return "CALL 911 IMMEDIATELY - This requires emergency medical attention"
        elif urgency_score >= 6:
            return "Seek urgent care immediately - Visit emergency room or urgent care clinic"
        elif urgency_score >= 4:
            return "Schedule medical consultation soon - Contact your doctor within 24-48 hours"
        elif urgency_score >= 2:
            return "Monitor symptoms - Schedule routine appointment if symptoms persist"
        else:
            return "General health inquiry - No immediate medical attention required"
    
    def _fallback_analysis(self, transcript):
        """Fallback to simple keyword-based analysis if AI fails"""
        transcript_lower = transcript.lower()
        
        # Critical keywords
        critical_keywords = ['emergency', 'urgent', 'help', 'dying', 'heart attack', 'stroke', 
                           'can\'t breathe', 'chest pain', 'bleeding', 'unconscious', 'seizure']
        
        # High priority keywords
        high_keywords = ['severe', 'extreme', 'intense', 'bad', 'terrible', 'awful',
                        'broken', 'accident', 'injury', 'blood']
        
        # Medium priority keywords
        medium_keywords = ['pain', 'hurt', 'sick', 'fever', 'cough', 'vomiting',
                          'dizzy', 'weak', 'tired']
        
        # Count keyword matches
        critical_count = sum(1 for keyword in critical_keywords if keyword in transcript_lower)
        high_count = sum(1 for keyword in high_keywords if keyword in transcript_lower)
        medium_count = sum(1 for keyword in medium_keywords if keyword in transcript_lower)
        
        # Calculate urgency
        if critical_count > 0:
            urgency_score = 8 + min(critical_count, 2)
            urgency_rank = 1
            severity = "critical"
        elif high_count > 0:
            urgency_score = 5 + min(high_count * 0.5, 3)
            urgency_rank = 2
            severity = "high"
        elif medium_count > 0:
            urgency_score = 2 + min(medium_count * 0.3, 3)
            urgency_rank = 2
            severity = "medium"
        else:
            urgency_score = 1
            urgency_rank = 3
            severity = "low"
        
        detected_symptoms = self._detect_symptoms(transcript)
        
        return {
            'urgencyScore': round(urgency_score, 2),
            'urgencyRank': urgency_rank,
            'severity': severity,
            'detectedSymptoms': detected_symptoms,
            'recommendation': self._generate_recommendation(urgency_score, detected_symptoms),
            'confidence': 50,
            'aiClassification': 'Fallback keyword analysis'
        }


def main():
    """Main function to analyze urgency from command line"""
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'No transcript provided'}))
        sys.exit(1)
    
    transcript = sys.argv[1]
    
    try:
        analyzer = MedicalUrgencyAnalyzer()
        result = analyzer.analyze_urgency(transcript)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()