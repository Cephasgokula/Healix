# 🔬 ML Diagnosis Flow Documentation

This document explains how the machine learning disease diagnosis system works in Qurelio.

---

## 📊 **Type 1: Parameter-Based Diagnosis**

**Applies to:** Diabetes, Thyroid, Breast Cancer

### Complete Flow:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. USER INPUT (Frontend - DiagnosesPage.jsx)                  │
│     User fills form with medical parameters                     │
│     Example (Diabetes):                                         │
│       • Pregnancies: 5                                          │
│       • Glucose: 148 mg/dL                                      │
│       • Blood Pressure: 72 mm Hg                                │
│       • Skin Thickness: 35 mm                                   │
│       • Insulin: 125 mu U/ml                                    │
│       • BMI: 33.6                                               │
│       • Diabetes Pedigree Function: 0.627                       │
│       • Age: 45                                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. FRONTEND SUBMISSION                                         │
│     axios.post("http://127.0.0.1:5000/diagnose_Diabetes", {    │
│       "Pregnancies": 5,                                         │
│       "Glucose": 148,                                           │
│       "BloodPressure": 72,                                      │
│       ...                                                       │
│     })                                                          │
│     Sends JSON object with all parameter values                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. FLASK BACKEND RECEIVES REQUEST (app.py)                     │
│     @app.route('/diagnose_Diabetes', methods=['POST'])          │
│     data = request.get_json()                                   │
│     → Receives: {"Pregnancies": 5, "Glucose": 148, ...}        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. LOAD PRE-TRAINED ML MODEL                                   │
│     diabetes_model = pickle.load(                               │
│         open('./Ml Models/diabetes.pkl', 'rb')                  │
│     )                                                           │
│     → Loads trained scikit-learn classifier from disk           │
│     → Model was trained on thousands of patient records         │
│     → Contains learned patterns and decision boundaries         │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. PREPARE INPUT DATA                                          │
│     int_features = [value for value in data.values()]           │
│     → Converts to list: [5, 148, 72, 35, 125, 33.6, 0.627, 45] │
│                                                                 │
│     final = [np.array(int_features)]                            │
│     → Converts to numpy array format model expects              │
│     → Shape: [[5, 148, 72, 35, 125, 33.6, 0.627, 45]]          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. RUN ML PREDICTION                                           │
│     prediction = diabetes_model.predict_proba(final)            │
│                                                                 │
│     Model Internally:                                           │
│     ├─ Normalizes input features                                │
│     ├─ Applies learned weights & decision boundaries            │
│     ├─ Calculates probability using trained algorithm           │
│     └─ Returns probability array                                │
│                                                                 │
│     Result: [[0.32, 0.68]]                                      │
│            ↑      ↑                                             │
│            |      └─ Probability of HAVING diabetes (68%)       │
│            └─ Probability of NOT having diabetes (32%)          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. EXTRACT & FORMAT PROBABILITY                                │
│     output = '{0:.{1}f}'.format(prediction[0][1], 2)           │
│     → Extracts positive class probability: 0.68                 │
│     → Formats to 2 decimal places: "0.68"                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  8. SEND JSON RESPONSE TO FRONTEND                              │
│     return jsonify({                                            │
│         'status': 'success',                                    │
│         'probability': "0.68"                                   │
│     })                                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  9. FRONTEND PROCESSES RESULT (DiagnosesPage.jsx)               │
│     const probability = parseFloat(res.data.probability)        │
│     const percentage = (probability * 100).toFixed(1)           │
│     → Converts to percentage: 68%                               │
│                                                                 │
│     Color Coding Logic:                                         │
│     ├─ probability > 0.75  → 🔴 RED (High Risk)                │
│     ├─ probability 0.3-0.75 → 🟡 YELLOW (Medium Risk)          │
│     └─ probability < 0.3   → 🟢 GREEN (Low Risk)               │
│                                                                 │
│     Display: "Probability of Diabetes: 68% 🟡"                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  10. USER SEES FINAL RESULT                                     │
│      ┌───────────────────────────────────────┐                 │
│      │  Diabetes Diagnosis Result            │                 │
│      │  ─────────────────────────────────    │                 │
│      │  Probability: 68% 🟡                  │                 │
│      │  Risk Level: MEDIUM                   │                 │
│      │  Recommendation: Consult a doctor     │                 │
│      └───────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Diseases Using This Flow:

| Disease | Model File | Input Parameters | Endpoint |
|---------|-----------|------------------|----------|
| **Diabetes** | `diabetes.pkl` | 8 parameters (Glucose, BMI, Age, etc.) | `/diagnose_Diabetes` |
| **Thyroid** | `thyroid_model.pkl` | 11 parameters (T3, TT4, FTI, etc.) | `/diagnose_Thyroid` |
| **Breast Cancer** | `Breast_Cancer_Model.pkl` | 16 parameters (radius, texture, area, etc.) | `/diagnose_Breast_Cancer` |

---

## 🖼️ **Type 2: Image-Based Diagnosis**

**Applies to:** COVID-19, Pneumonia

### Complete Flow:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. USER INPUT (Frontend - DiagnosesPage.jsx)                  │
│     User uploads chest X-ray image file                         │
│     Supported formats: JPG, PNG, JPEG                           │
│     Example: patient_xray.jpg (150 KB)                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. FRONTEND SUBMISSION                                         │
│     const formData = new FormData()                             │
│     formData.append('image', imageFile)                         │
│     axios.post(                                                 │
│         "http://127.0.0.1:5000/diagnose_Covid",                │
│         formData,                                               │
│         { headers: { 'Content-Type': 'multipart/form-data' } } │
│     )                                                           │
│     Sends image file as multipart form data                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. FLASK BACKEND RECEIVES REQUEST (app.py)                     │
│     @app.route('/diagnose_Covid', methods=['POST'])             │
│     if 'image' not in request.files:                            │
│         return error                                            │
│     → Receives image file from request                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. LOAD PRE-TRAINED ML MODEL                                   │
│     Covid_model = tf.keras.models.load_model(                   │
│         './Ml Models/Covid2.h5'                                 │
│     )                                                           │
│     → Loads trained TensorFlow/Keras neural network             │
│     → Model: Convolutional Neural Network (CNN)                 │
│     → Trained on thousands of COVID/Normal X-ray images         │
│     → Learned to detect COVID patterns (ground-glass opacity,   │
│       consolidations, etc.)                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. IMAGE PREPROCESSING                                         │
│     image = request.files['image'].read()                       │
│     → Read raw image bytes                                      │
│                                                                 │
│     nparr = np.frombuffer(image, np.uint8)                      │
│     → Convert bytes to numpy array                              │
│                                                                 │
│     image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)              │
│     → Decode to OpenCV image format (RGB)                       │
│                                                                 │
│     image = cv2.resize(image, (64, 64))                         │
│     → Resize to model's expected input size                     │
│     → COVID model: 64x64 pixels                                 │
│     → Pneumonia model: 150x150 pixels                           │
│                                                                 │
│     image = np.expand_dims(image, axis=0)                       │
│     → Add batch dimension: (1, 64, 64, 3)                       │
│     → Format: [batch_size, height, width, channels]             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. RUN ML PREDICTION (DEEP LEARNING)                           │
│     prediction = Covid_model.predict(image)                     │
│                                                                 │
│     Neural Network Processing:                                  │
│     ├─ Layer 1: Convolutional filters detect edges              │
│     ├─ Layer 2: Detect textures and patterns                    │
│     ├─ Layer 3: Detect shapes (lung boundaries, opacities)      │
│     ├─ Layer 4: Detect complex features (consolidations)        │
│     ├─ Pooling: Reduce image dimensions                         │
│     ├─ Flatten: Convert to 1D array                             │
│     ├─ Dense layers: High-level decision making                 │
│     └─ Output layer: Probability score                          │
│                                                                 │
│     Result: [[0.87]]  ← 87% probability of COVID-19            │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  7. EXTRACT & FORMAT PROBABILITY                                │
│     output = '{0:.{1}f}'.format(prediction[0][0], 2)           │
│     → Extracts probability: 0.87                                │
│     → Formats to 2 decimal places: "0.87"                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  8. SEND JSON RESPONSE TO FRONTEND                              │
│     return jsonify({                                            │
│         'status': 'success',                                    │
│         'probability': "0.87"                                   │
│     })                                                          │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  9. FRONTEND PROCESSES RESULT (DiagnosesPage.jsx)               │
│     const probability = parseFloat(res.data.probability)        │
│     const percentage = (probability * 100).toFixed(1)           │
│     → Converts to percentage: 87%                               │
│                                                                 │
│     Color Coding Logic:                                         │
│     ├─ probability > 0.75  → 🔴 RED (High Risk)                │
│     ├─ probability 0.3-0.75 → 🟡 YELLOW (Medium Risk)          │
│     └─ probability < 0.3   → 🟢 GREEN (Low Risk)               │
│                                                                 │
│     Display: "Probability of COVID-19: 87% 🔴"                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  10. USER SEES FINAL RESULT                                     │
│      ┌───────────────────────────────────────┐                 │
│      │  COVID-19 Diagnosis Result            │                 │
│      │  ─────────────────────────────────    │                 │
│      │  Probability: 87% 🔴                  │                 │
│      │  Risk Level: HIGH                     │                 │
│      │  Recommendation: Seek immediate       │                 │
│      │  medical attention                    │                 │
│      │  [X-ray Preview]                      │                 │
│      └───────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Diseases Using This Flow:

| Disease | Model File | Input Type | Image Size | Endpoint |
|---------|-----------|-----------|------------|----------|
| **COVID-19** | `Covid2.h5` | Chest X-ray | 64x64 pixels | `/diagnose_Covid` |
| **Pneumonia** | `pneumonia_model.pkl` | Chest X-ray | 150x150 pixels | `/diagnose_Pneumonia` |

---

## 🔑 **Key Differences Between Two Types:**

| Aspect | Parameter-Based | Image-Based |
|--------|----------------|-------------|
| **Input** | Numeric values (form data) | Image file (multipart/form-data) |
| **Format** | JSON object | Binary image file |
| **Preprocessing** | Convert to numpy array | Decode, resize, normalize image |
| **Model Type** | Scikit-learn (Traditional ML) | TensorFlow/Keras (Deep Learning) |
| **Model Function** | `predict_proba()` | `predict()` |
| **Processing Time** | Fast (~100ms) | Slower (~500ms - 2s) |
| **Model Size** | Small (50KB - 2MB) | Large (Covid2.h5 = ~20MB) |

---

## 🎯 **Important Notes:**

1. **No Hardcoding:** All probabilities come directly from trained ML models
2. **Real Predictions:** Models were trained on actual medical datasets
3. **Pre-trained:** Models are loaded from disk (not trained on-the-fly)
4. **Consistent Logic:** Same color-coding rules for all diseases
5. **Error Handling:** Try-catch blocks handle model loading errors

---

## 📂 **Model Files Location:**

```
Server/
└── Ml Models/
    ├── diabetes.pkl              # Diabetes classifier
    ├── thyroid_model.pkl          # Thyroid classifier
    ├── Breast_Cancer_Model.pkl    # Breast cancer classifier
    ├── pneumonia_model.pkl        # Pneumonia image classifier
    └── Covid2.h5                  # COVID-19 deep learning model
```

---

## 🔬 **Model Training (Not in this codebase):**

These models were trained separately using:
- Medical datasets (patient records, X-ray images)
- Scikit-learn for parameter-based models
- TensorFlow/Keras for image-based models
- Saved and exported as `.pkl` or `.h5` files
- Loaded in Flask backend for real-time predictions

---

**Last Updated:** November 15, 2025
