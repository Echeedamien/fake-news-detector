import pickle
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import json
import nltk
nltk.download('stopwords')

stemmer = PorterStemmer()
stop_words = set(stopwords.words('english'))

try:
    with open('api/fake_news_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('api/tfidf_vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)
    model_loaded = True
except:
    model_loaded = False

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = text.split()
    tokens = [word for word in tokens if word not in stop_words]
    tokens = [stemmer.stem(word) for word in tokens]
    return ' '.join(tokens)

def handler(request, response):
    if not model_loaded:
        return response.json({"error": "Model not loaded", "status": "error"}, status=500)

    try:
        body = request.json()
        text = body.get("text", "")

        if not text.strip():
            return response.json({"error": "No text provided"}, status=400)

        processed = preprocess_text(text)
        vector = vectorizer.transform([processed])
        prediction = model.predict(vector)[0]
        proba = model.predict_proba(vector)[0]

        real_prob = float(proba[1])
        fake_prob = float(proba[0])

        return response.json({
            "prediction": "Real News" if prediction == 1 else "Fake News",
            "confidence": round(max(real_prob, fake_prob) * 100, 2),
            "real_probability": round(real_prob * 100, 2),
            "fake_probability": round(fake_prob * 100, 2),
            "status": "success"
        })

    except Exception as e:
        return response.json({"error": str(e)}, status=500)

@app.route('/')
def home():
    return render_template('index.html', model_loaded=model_loaded)

@app.route('/analyze', methods=['POST'])
def analyze_news():
    try:
        if not model_loaded:
            return jsonify({
                'error': 'Model not loaded. Please train the model first.',
                'status': 'error'
            }), 500
            
        data = request.get_json()
        news_text = data.get('text', '')
        
        if not news_text.strip():
            return jsonify({
                'error': 'Please enter some text to analyze'
            }), 400
        
        # Preprocess the text
        processed_text = preprocess_text(news_text)
        
        # Vectorize the text
        text_vector = vectorizer.transform([processed_text])
        
        # Make prediction
        prediction = model.predict(text_vector)[0]
        probability = model.predict_proba(text_vector)[0]
        
        # Get confidence scores
        real_prob = probability[1] if prediction == 1 else probability[0]
        fake_prob = probability[0] if prediction == 1 else probability[1]
        
        result = {
            'prediction': 'Real News' if prediction == 1 else 'Fake News',
            'confidence': round(max(real_prob, fake_prob) * 100, 2),
            'real_probability': round(real_prob * 100, 2),
            'fake_probability': round(fake_prob * 100, 2),
            'status': 'success'
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': model_loaded})

if __name__ == '__main__':
    # Create model directory if it doesn't exist
    if not os.path.exists('model'):
        os.makedirs('model')
        
    app.run(debug=True, host='0.0.0.0', port=5000)