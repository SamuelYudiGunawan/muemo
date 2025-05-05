from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np 
import cv2
from deepface import DeepFace
import os

app = Flask(__name__)

# Configure CORS more explicitly
CORS(app, resources={
    r"/detect_emotion": {
        "origins": ["https://muemo-frontend-950251872768.us-central1.run.app", "http://localhost:*"],
        "methods": ["POST", "OPTIONS"],  # Add OPTIONS for preflight
        "allow_headers": ["Content-Type"]
    }
})

@app.route('/detect_emotion', methods=['POST', 'OPTIONS'])  # Add OPTIONS method
def detect_emotion():
    if request.method == 'OPTIONS':
        # Handle preflight request
        return jsonify({}), 200
    
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
            
        file = request.files['image'].read()
        np_arr = np.frombuffer(file, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
        emotion = result[0]['dominant_emotion']

        return jsonify({'emotion': emotion})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000)) 
    app.run(host='0.0.0.0', port=port)