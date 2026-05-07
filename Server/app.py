import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import cv2
import tensorflow as tf
from dotenv import load_dotenv

load_dotenv()

# ---- Logging setup ----
logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# CORS origin from env — never hardcode (Rule 2)
CORS_ORIGIN = os.environ.get('CORS_ORIGIN', 'http://localhost:3000')
CORS(app, supports_credentials=True, origins=[CORS_ORIGIN])


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', CORS_ORIGIN)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response


# Handle preflight requests for all endpoints
@app.route('/diagnose_Diabetes', methods=['OPTIONS'])
@app.route('/diagnose_Thyroid', methods=['OPTIONS'])
@app.route('/diagnose_Breast_Cancer', methods=['OPTIONS'])
@app.route('/diagnose_Pneumonia', methods=['OPTIONS'])
@app.route('/diagnose_Covid', methods=['OPTIONS'])
def options():
    response = jsonify({'message': 'CORS preflight request successful'})
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
    return response


# ---- Load models once at startup (not per-request) ----
MODEL_DIR = './Ml Models'

logger.info('Loading ML models...')

try:
    diabetes_model = pickle.load(open(f'{MODEL_DIR}/diabetes.pkl', 'rb'))
    logger.info('✅ Diabetes model loaded')
except Exception as e:
    diabetes_model = None
    logger.error('❌ Failed to load diabetes model: %s', e)

try:
    thyroid_model = pickle.load(open(f'{MODEL_DIR}/thyroid_model.pkl', 'rb'))
    logger.info('✅ Thyroid model loaded')
except Exception as e:
    thyroid_model = None
    logger.error('❌ Failed to load thyroid model: %s', e)

try:
    breast_cancer_model = pickle.load(open(f'{MODEL_DIR}/Breast_Cancer_Model.pkl', 'rb'))
    logger.info('✅ Breast cancer model loaded')
except Exception as e:
    breast_cancer_model = None
    logger.error('❌ Failed to load breast cancer model: %s', e)

try:
    pneumonia_model = tf.keras.models.load_model(f'{MODEL_DIR}/pneumonia_model.h5', compile=False)
    logger.info('✅ Pneumonia model loaded')
except Exception as e:
    pneumonia_model = None
    logger.error('❌ Failed to load pneumonia model: %s', e)

try:
    covid_model = tf.keras.models.load_model(f'{MODEL_DIR}/Covid2.h5')
    logger.info('✅ COVID-19 model loaded')
except Exception as e:
    covid_model = None
    logger.error('❌ Failed to load COVID-19 model: %s', e)

logger.info('Model loading complete.')


# ---- Helper: safe error response (Rule 3 — never expose raw errors) ----
def error_response(user_message: str, exception: Exception, status_code: int = 500):
    """Log the real error server-side but return a safe message to the client."""
    logger.error('%s — %s', user_message, exception, exc_info=True)
    return jsonify({'status': 'failed', 'error': user_message}), status_code


# ============================================================
# Diabetes Controller
# ============================================================
@app.route('/diagnose_Diabetes', methods=['POST'])
def diagnose_Diabetes():
    try:
        if diabetes_model is None:
            return error_response('Diabetes model is not available', Exception('Model not loaded'), 503)

        data = request.get_json()
        int_features = [
            float(data['Pregnancies']),
            float(data['Glucose']),
            float(data['BloodPressure']),
            float(data['SkinThickness']),
            float(data['Insulin']),
            float(data['BMI']),
            float(data['DiabetesPedigreeFunction']),
            float(data['Age'])
        ]
        final = [np.array(int_features)]
        prediction = diabetes_model.predict_proba(final)
        output = '{0:.{1}f}'.format(prediction[0][1], 2)
        return jsonify({'status': 'success', 'probability': output})
    except KeyError as e:
        return error_response(f'Missing required field: {e}', e, 400)
    except Exception as e:
        return error_response('Diabetes diagnosis failed', e)


# ============================================================
# Thyroid Controller
# ============================================================
@app.route('/diagnose_Thyroid', methods=['POST'])
def diagnose_Thyroid():
    try:
        if thyroid_model is None:
            return error_response('Thyroid model is not available', Exception('Model not loaded'), 503)

        data = request.get_json()
        int_features = [
            float(data['age']),
            float(data['on_thyroxine']),
            float(data['query_on_thyroxine']),
            float(data['on_antithyroid_medication']),
            float(data['pregnant']),
            float(data['thyroid_surgery']),
            float(data['tumor']),
            float(data['T3']),
            float(data['TT4']),
            float(data['T4U']),
            float(data['FTI'])
        ]
        final = [np.array(int_features)]
        prediction = thyroid_model.predict_proba(final)
        output = '{0:.{1}f}'.format(prediction[0][1], 2)
        return jsonify({'status': 'success', 'probability': output})
    except KeyError as e:
        return error_response(f'Missing required field: {e}', e, 400)
    except Exception as e:
        return error_response('Thyroid diagnosis failed', e)


# ============================================================
# Breast Cancer Controller
# ============================================================
@app.route('/diagnose_Breast_Cancer', methods=['POST'])
def diagnose_Breast_Cancer():
    try:
        if breast_cancer_model is None:
            return error_response('Breast cancer model is not available', Exception('Model not loaded'), 503)

        data = request.get_json()
        int_features = [
            float(data['radius_mean']),
            float(data['texture_mean']),
            float(data['perimeter_mean']),
            float(data['area_mean']),
            float(data['smoothness_mean']),
            float(data['compactness_mean']),
            float(data['concavity_mean']),
            float(data['concave_points_mean']),
            float(data['radius_worst']),
            float(data['texture_worst']),
            float(data['perimeter_worst']),
            float(data['area_worst']),
            float(data['smoothness_worst']),
            float(data['compactness_worst']),
            float(data['concavity_worst']),
            float(data['concave_points_worst'])
        ]
        final = [np.array(int_features)]
        prediction = breast_cancer_model.predict_proba(final)
        output = '{0:.{1}f}'.format(prediction[0][1], 2)
        return jsonify({'status': 'success', 'probability': float(output)})
    except KeyError as e:
        return error_response(f'Missing required field: {e}', e, 400)
    except Exception as e:
        return error_response('Breast cancer diagnosis failed', e)


# ============================================================
# Pneumonia Controller
# ============================================================
@app.route('/diagnose_Pneumonia', methods=['POST'])
def diagnose_Pneumonia():
    try:
        if pneumonia_model is None:
            return error_response('Pneumonia model is not available', Exception('Model not loaded'), 503)

        if 'image' not in request.files:
            return jsonify({'status': 'failed', 'error': 'No image file uploaded'}), 400

        image_bytes = request.files['image'].read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({'status': 'failed', 'error': 'Invalid image file — could not decode'}), 400

        image = cv2.resize(image, (150, 150))
        image = np.expand_dims(image, axis=0)
        prediction = pneumonia_model.predict(image)
        output = '{0:.{1}f}'.format(prediction[0][1], 2)
        return jsonify({'status': 'success', 'probability': output})
    except Exception as e:
        return error_response('Pneumonia diagnosis failed', e)


# ============================================================
# Covid Controller
# ============================================================
@app.route('/diagnose_Covid', methods=['POST'])
def diagnose_Covid():
    try:
        if covid_model is None:
            return error_response('COVID-19 model is not available', Exception('Model not loaded'), 503)

        if 'image' not in request.files:
            return jsonify({'status': 'failed', 'error': 'No image file uploaded'}), 400

        image_bytes = request.files['image'].read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({'status': 'failed', 'error': 'Invalid image file — could not decode'}), 400

        image = cv2.resize(image, (64, 64))
        image = np.expand_dims(image, axis=0)
        prediction = covid_model.predict(image)
        output = '{0:.{1}f}'.format(prediction[0][0], 2)
        return jsonify({'status': 'success', 'probability': output})
    except Exception as e:
        return error_response('COVID-19 diagnosis failed', e)


if __name__ == '__main__':
    app.run(debug=True)