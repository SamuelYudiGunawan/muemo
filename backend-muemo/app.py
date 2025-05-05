from flask import Flask, request, jsonify
from flask_cors import cross_origin
import numpy as np 
import cv2
from deepface import DeepFace
import os

app = Flask(__name__)

@app.route('/api/detect_emotion', methods=['POST', 'OPTIONS'])
@cross_origin(
    origins=[
        "https://muemo-production.up.railway.app",
    ],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"]
)
def detect_emotion():
    if request.method == 'OPTIONS':
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
    port = int(os.environ.get('PORT', 8080)) 
    app.run(host='0.0.0.0', port=port)
