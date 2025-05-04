from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np 
import cv2
from deepface import DeepFace
import os

app = Flask(__name__)
# Allow requests from your frontend domain (replace with your actual frontend URL)
CORS(app, resources={
    r"/detect_emotion": {
        "origins": [
            "https://muemo-production.up.railway.app",
            "http://localhost:3000" 
        ]
    }
})

@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    try:
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
