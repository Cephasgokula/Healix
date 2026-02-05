<div align="center">
  
# 🏥 Healix

### AI-Powered Healthcare Diagnostic Platform

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Flask](https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://tensorflow.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

*Empowering healthcare with AI-driven disease prediction and emergency triage*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [ML Models](#-ml-models) • [API Endpoints](#-api-endpoints) • [Screenshots](#-screenshots)

</div>

---

## 📋 Overview

**Healix** is a comprehensive full-stack healthcare platform that leverages machine learning and artificial intelligence to provide:

- 🔬 **Disease Risk Prediction** - Analyze health parameters to predict disease probability
- 🎙️ **Voice-Based Symptom Reporting** - Speak your symptoms with real-time transcription
- 🚨 **AI Emergency Triage** - Automatic urgency ranking for medical staff prioritization
- 🏥 **Hospital Appointment Booking** - Find and connect with healthcare providers
- 👨‍⚕️ **Admin Dashboard** - Monitor patients and emergency cases in real-time

---

## ✨ Features

### 🤖 AI/ML Capabilities

| Feature | Description | Technology |
|---------|-------------|------------|
| **Disease Prediction** | Predict 5 diseases with up to 98% accuracy | scikit-learn, TensorFlow |
| **Image Analysis** | X-ray based Pneumonia & COVID-19 detection | CNN, OpenCV, Keras |
| **NLP Triage** | Zero-shot classification for symptom analysis | Hugging Face Transformers |
| **Voice Processing** | Real-time speech-to-text transcription | Web Speech API |

### 🩺 Supported Diagnoses

| Disease | Type | Model | Accuracy |
|---------|------|-------|----------|
| 🩸 Diabetes | Parameter-based | Logistic Regression | 90% |
| 🦋 Thyroid | Parameter-based | Random Forest | 98% |
| 🎀 Breast Cancer | Parameter-based | Logistic Regression | 95% |
| 🫁 Pneumonia | Image-based (X-ray) | CNN | 92% |
| 🦠 COVID-19 | Image-based (X-ray) | CNN | 90% |

### 👥 User Features

- ✅ User Authentication (Signup/Login/Password Reset)
- ✅ Interactive Disease Diagnosis Forms
- ✅ X-ray Image Upload for Analysis
- ✅ Voice Recording for Symptom Description
- ✅ Hospital Directory & Appointment Booking
- ✅ Real-time Notifications

### 👨‍💼 Admin Features

- ✅ User Management Dashboard
- ✅ Emergency Cases Ranking (AI-powered)
- ✅ Audio Playback & Transcript Review
- ✅ Priority-based Patient Triage (High/Medium/Low)
- ✅ Analytics & Statistics

---

## 🛠️ Tech Stack

### Frontend
```
React.js 18.2 | Vite | Tailwind CSS | Material-UI | Framer Motion
React Router DOM | Axios | Recharts | Swiper | React Toastify
```

### Backend
```
Node.js | Express.js | Flask | MongoDB | Mongoose
JWT Authentication | Bcrypt.js | Multer | GridFS | Nodemailer
```

### Machine Learning
```
TensorFlow/Keras | scikit-learn | OpenCV | NumPy
Hugging Face Transformers (BART) | Pickle/Joblib
```

### APIs & Services
```
Web Speech API | REST APIs | CORS
```

---

## 📁 Project Structure

```
healix/
├── client/                    # React Frontend
│   ├── public/
│   │   └── assets/           # Images & Icons
│   ├── src/
│   │   ├── Components/       # Reusable UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── ServicesCard.jsx
│   │   │   └── ...
│   │   ├── Pages/            # Application Pages
│   │   │   ├── Hero.jsx
│   │   │   ├── DiagnosesPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── EmergencyRanking.jsx
│   │   │   └── ...
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Server/                    # Backend Services
│   ├── Controllers/          # Route Controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── passwordController.js
│   ├── Models/               # MongoDB Schemas
│   │   ├── userModel.js
│   │   ├── AudioUpload.js
│   │   └── reviewModel.js
│   ├── Routes/               # API Routes
│   │   └── userRoutes.js
│   ├── utils/                # Utility Functions
│   │   ├── SendMail.js
│   │   └── appError.js
│   ├── AI_Urgency/           # AI Analysis Module
│   │   ├── aiAnalysis.py
│   │   └── requirements_ai.txt
│   ├── Ml Models/            # Trained ML Models
│   │   ├── diabetes.pkl
│   │   ├── thyroid_model.pkl
│   │   ├── Breast_Cancer_Model.pkl
│   │   ├── pneumonia_model.h5
│   │   └── Covid2.h5
│   ├── app.py                # Flask ML Server
│   ├── app.js                # Express Server Config
│   ├── server.js             # Main Node Server
│   └── config.env            # Environment Variables
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/healix.git
cd healix
```

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 3️⃣ Backend Node Server Setup

```bash
cd Server

# Create environment file
touch config.env
```

Add the following to `config.env`:

```env
DATABASE=mongodb+srv://your-mongodb-uri
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=90d
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

```bash
npm install
npm run start
```

Node server runs on: `http://localhost:3000`

### 4️⃣ Backend Python (ML) Server Setup

```bash
cd Server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

Flask ML server runs on: `http://localhost:5000`

---

## 🧠 ML Models

### Parameter-Based Models

#### Diabetes Prediction
```python
Input Features:
- Pregnancies, Glucose, BloodPressure, SkinThickness
- Insulin, BMI, DiabetesPedigreeFunction, Age

Model: Logistic Regression with StandardScaler
Output: Probability (0-1)
```

#### Thyroid Disease Prediction
```python
Input Features:
- age, on_thyroxine, query_on_thyroxine
- on_antithyroid_medication, pregnant, thyroid_surgery
- tumor, T3, TT4, T4U, FTI

Model: Random Forest Classifier
Output: Probability (0-1)
```

#### Breast Cancer Prediction
```python
Input Features:
- radius_mean, texture_mean, perimeter_mean, area_mean
- smoothness_mean, compactness_mean, concavity_mean
- concave_points_mean, radius_worst, texture_worst
- perimeter_worst, area_worst, smoothness_worst
- compactness_worst, concavity_worst, concave_points_worst

Model: Logistic Regression
Output: Probability (0-1)
```

### Image-Based Models (CNN)

#### Pneumonia Detection
```python
Input: Chest X-ray image (150x150 RGB)
Model: Convolutional Neural Network (Keras)
Output: Probability of Pneumonia
```

#### COVID-19 Detection
```python
Input: Chest X-ray image (64x64 RGB)
Model: Convolutional Neural Network (Keras)
Output: Probability of COVID-19
```

### AI Urgency Analyzer

```python
Model: facebook/bart-large-mnli (Zero-shot Classification)
Input: Patient symptom transcript (text)
Output:
  - Urgency Score (0-10)
  - Urgency Rank (1=High, 2=Medium, 3=Low)
  - Severity Level (critical/high/medium/low/minimal)
  - Detected Symptoms
  - Recommendation
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Register new user |
| POST | `/login` | User login |
| POST | `/forgotPassword` | Request password reset |
| PATCH | `/:encryptedData` | Update password |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/allusers` | Get all users (Admin) |
| GET | `/user/:id` | Get user by ID |
| POST | `/createuser` | Create new user |
| DELETE | `/user/:id` | Delete user |

### Disease Diagnosis (Flask)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/diagnose_Diabetes` | Diabetes prediction |
| POST | `/diagnose_Thyroid` | Thyroid prediction |
| POST | `/diagnose_Breast_Cancer` | Breast cancer prediction |
| POST | `/diagnose_Pneumonia` | Pneumonia detection (X-ray) |
| POST | `/diagnose_Covid` | COVID-19 detection (X-ray) |

### Audio & Emergency
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-audio` | Upload voice recording |
| GET | `/emergency-ranking` | Get priority-ranked patients |
| GET | `/audio/:id` | Stream audio file |

---

## 🖼️ Screenshots

### 🏠 Home Page
*Modern landing page with smooth animations and service overview*

### 🔬 Diagnosis Page
*Interactive forms for disease prediction with real-time results*

### 🎙️ Voice Recorder
*Floating microphone button for voice-based symptom reporting*

### 🚨 Emergency Dashboard (Admin)
*AI-powered patient triage with priority ranking*

---

## 🔒 Security Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔑 **Password Hashing** - Bcrypt with salt rounds
- ✉️ **Email Verification** - Secure password reset via email
- 🛡️ **CORS Protection** - Configured cross-origin policies
- 🔒 **Data Encryption** - Sensitive data encryption

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [TensorFlow](https://tensorflow.org/) for deep learning framework
- [Hugging Face](https://huggingface.co/) for transformer models
- [scikit-learn](https://scikit-learn.org/) for classical ML algorithms
- [React](https://reactjs.org/) for frontend framework
- [MongoDB](https://mongodb.com/) for database

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for better healthcare

</div>
