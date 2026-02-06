# 🏥 ML Models - Dataset Sources & Test Cases

**Last Updated:** November 15, 2025  
**Purpose:** Documentation for all 5 ML diagnosis models with dataset sources and ready-to-use test cases

---

## 1️⃣ Diabetes Prediction Model

### 📁 Dataset Source
- **Source:** Synthetically generated using medical distributions
- **Generation Script:** `train_all_models.py`
- **Training Samples:** 1000 patient records
- **Algorithm:** Logistic Regression with StandardScaler
- **Accuracy:** 90%

### 🧪 Test Case 1: Low Risk
```json
{
  "Pregnancies": 1,
  "Glucose": 85,
  "BloodPressure": 65,
  "SkinThickness": 20,
  "Insulin": 50,
  "BMI": 22.0,
  "DiabetesPedigreeFunction": 0.3,
  "Age": 25
}
```
**Expected:** 0-5% probability (Healthy young adult with normal values)

### 🧪 Test Case 2: High Risk
```json
{
  "Pregnancies": 10,
  "Glucose": 180,
  "BloodPressure": 95,
  "SkinThickness": 45,
  "Insulin": 250,
  "BMI": 35.0,
  "DiabetesPedigreeFunction": 1.5,
  "Age": 65
}
```
**Expected:** 85-98% probability (Elderly, obese, high glucose, strong family history)

---

## 2️⃣ Thyroid Disease Model

### 📁 Dataset Source
- **Source:** Synthetically generated based on thyroid disease patterns
- **Generation Script:** `train_all_models.py`
- **Training Samples:** 1000 patient records
- **Algorithm:** Random Forest Classifier with StandardScaler
- **Accuracy:** 98%

### 🧪 Test Case 1: Healthy
```json
{
  "age": 25,
  "on_thyroxine": 0,
  "query_on_thyroxine": 0,
  "on_antithyroid_medication": 0,
  "pregnant": 0,
  "thyroid_surgery": 0,
  "tumor": 0,
  "T3": 1.2,
  "TT4": 95,
  "T4U": 0.9,
  "FTI": 105
}
```
**Expected:** 0-5% probability (Young, no medications, normal hormone levels)

### 🧪 Test Case 2: High Risk
```json
{
  "age": 60,
  "on_thyroxine": 1,
  "query_on_thyroxine": 1,
  "on_antithyroid_medication": 1,
  "pregnant": 0,
  "thyroid_surgery": 1,
  "tumor": 1,
  "T3": 3.2,
  "TT4": 180,
  "T4U": 1.8,
  "FTI": 190
}
```
**Expected:** 80-90% probability (Elderly, all medications, surgery, tumor, abnormal levels)

---

## 3️⃣ Breast Cancer Model

### 📁 Dataset Source
- **Source:** Synthetically generated based on breast mass characteristics
- **Generation Script:** `train_all_models.py`
- **Training Samples:** 1000 mass measurements
- **Algorithm:** Random Forest Classifier with StandardScaler
- **Accuracy:** 91.5%

### 🧪 Test Case 1: Benign
```json
{
  "radius_mean": 10.5,
  "texture_mean": 12.0,
  "perimeter_mean": 70.0,
  "area_mean": 400.0,
  "smoothness_mean": 0.08,
  "compactness_mean": 0.05,
  "concavity_mean": 0.02,
  "concave_points_mean": 0.01,
  "radius_worst": 11.0,
  "texture_worst": 14.0,
  "perimeter_worst": 75.0,
  "area_worst": 450.0,
  "smoothness_worst": 0.09,
  "compactness_worst": 0.06,
  "concavity_worst": 0.03,
  "concave_points_worst": 0.015
}
```
**Expected:** 0-10% probability (Small, smooth, low compactness → Likely benign)

### 🧪 Test Case 2: Malignant
```json
{
  "radius_mean": 20.0,
  "texture_mean": 25.0,
  "perimeter_mean": 140.0,
  "area_mean": 1000.0,
  "smoothness_mean": 0.12,
  "compactness_mean": 0.15,
  "concavity_mean": 0.20,
  "concave_points_mean": 0.10,
  "radius_worst": 25.0,
  "texture_worst": 35.0,
  "perimeter_worst": 160.0,
  "area_worst": 1500.0,
  "smoothness_worst": 0.15,
  "compactness_worst": 0.25,
  "concavity_worst": 0.35,
  "concave_points_worst": 0.15
}
```
**Expected:** 60-80% probability (Large, irregular, high compactness → High risk)

---

## 4️⃣ COVID-19 Detection Model

### 📁 Dataset Source
- **Source:** Original pre-trained model (X-ray images)
- **Model File:** `Covid2.h5` (TensorFlow/Keras CNN)
- **Created:** October 2, 2025
- **Input:** RGB chest X-ray images (64x64 pixels)
- **Model Type:** Convolutional Neural Network

### 🧪 Test Case 1: Healthy X-ray
**Input:** Upload clear chest X-ray with no lung opacities  
**Expected:** 0-20% probability (Clear lung fields)

### 🧪 Test Case 2: COVID-19 X-ray
**Input:** Upload X-ray with bilateral ground-glass opacities  
**Expected:** 70-95% probability (COVID-19 lung patterns visible)

---

## 5️⃣ Pneumonia Detection Model

### 📁 Dataset Source
- **Source:** Converted from original Keras 2.14 model
- **Model File:** `pneumonia_model.h5` (TensorFlow/Keras CNN)
- **Converted:** November 15, 2025
- **Input:** Grayscale chest X-ray images (150x150 pixels)
- **Model Type:** Convolutional Neural Network

⚠️ **Note:** Model has random weights after conversion. Needs retraining for production.

### 🧪 Test Case 1: Normal X-ray
**Input:** Upload clear chest X-ray with no infiltrates  
**Expected:** 0-30% probability (No consolidation)

### 🧪 Test Case 2: Pneumonia X-ray
**Input:** Upload X-ray with lung consolidation/infiltrates  
**Expected:** 60-90% probability (Visible infiltrates)

---

## 🚀 How to Use These Test Cases

### Method 1: Frontend Testing (Recommended)
1. Start Flask: `cd Server && venv/bin/python3 app.py`
2. Start React: `cd client && npm run dev`
3. Go to http://localhost:5173
4. Navigate to Diagnoses page
5. Fill form with test case values
6. Submit and verify result matches expected range

### Method 2: Python Script
```python
import requests

# Test Diabetes Low Risk
response = requests.post('http://127.0.0.1:5000/diagnose_Diabetes', 
    json={
        "Pregnancies": 1,
        "Glucose": 85,
        "BloodPressure": 65,
        "SkinThickness": 20,
        "Insulin": 50,
        "BMI": 22.0,
        "DiabetesPedigreeFunction": 0.3,
        "Age": 25
    }
)
print(f"Result: {response.json()}")
# Expected: {"status": "success", "probability": "0.02"} or similar low value
```

### Method 3: cURL Command
```bash
curl -X POST http://127.0.0.1:5000/diagnose_Diabetes \
  -H "Content-Type: application/json" \
  -d '{
    "Pregnancies": 1,
    "Glucose": 85,
    "BloodPressure": 65,
    "SkinThickness": 20,
    "Insulin": 50,
    "BMI": 22.0,
    "DiabetesPedigreeFunction": 0.3,
    "Age": 25
  }'
```

---

## ✅ Validation Checklist

When testing, verify:
- [ ] Probability between 0.0 and 1.0
- [ ] Low-risk test case returns < 20%
- [ ] High-risk test case returns > 70%
- [ ] Different inputs produce different results
- [ ] No constant values (e.g., 0.474)
- [ ] No sklearn version warnings in Flask logs

---

## 📦 Current Model Files

```
Server/Ml Models/
├── diabetes.pkl              (1.3 KB, Nov 15 13:51) ✅
├── thyroid_model.pkl          (460 KB, Nov 15 13:51) ✅
├── Breast_Cancer_Model.pkl    (680 KB, Nov 15 13:51) ✅
├── pneumonia_model.h5         (3.5 MB, Nov 15 13:19) ⚠️
└── Covid2.h5                  (9.3 MB, Oct 2 14:37) ✅
```

**Space Saved:** Removed old `pneumonia_model.pkl` (11 MB) ✅

---

**Document Version:** 1.0  
**Created:** November 15, 2025
