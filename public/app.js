document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const tabs = document.querySelectorAll('.tab');
    const inputGroups = document.querySelectorAll('.input-group');
    const analyzeBtn = document.getElementById('analyze-btn');
    const newsText = document.getElementById('news-text');
    const articleUrl = document.getElementById('article-url');
    const errorDiv = document.getElementById('error');
    const loader = document.getElementById('loader');
    const results = document.getElementById('results');
    const predictionText = document.getElementById('prediction-text');
    const confidenceValue = document.getElementById('confidence-value');
    const realProb = document.getElementById('real-prob');
    const fakeProb = document.getElementById('fake-prob');
    const realFill = document.getElementById('real-fill');
    const fakeFill = document.getElementById('fake-fill');
    const modelStatus = document.getElementById('model-status');

    // Model state
    let modelLoaded = false;
    
    // Initialize the application
    initializeApp();

    function initializeApp() {
        // Start loading the model
        loadModel();
        
        // Set up event listeners
        setupEventListeners();
    }

    // Simulate model loading
    function loadModel() {
        // In a real app, you would load your TensorFlow.js model here
        // For example:
        // tf.loadLayersModel('model/model.json')
        //   .then(model => {
        //       window.model = model;
        //       modelLoaded = true;
        //       hideModelStatus();
        //       enableAnalyzeButton();
        //   })
        //   .catch(error => {
        //       showModelStatus('Failed to load model: ' + error.message);
        //   });
        
        // For demo purposes, we'll simulate successful loading after 2 seconds
        setTimeout(() => {
            modelLoaded = true;
            hideModelStatus();
            enableAnalyzeButton();
        }, 2000);
    }

    function setupEventListeners() {
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding input
                inputGroups.forEach(group => {
                    group.classList.remove('active');
                    if (group.id === `${tabName}-input`) {
                        group.classList.add('active');
                    }
                });
                
                // Clear previous results and errors
                hideError();
                hideResults();
            });
        });

        // Analyze button click
        analyzeBtn.addEventListener('click', () => {
            if (!modelLoaded) {
                showError('Model is not loaded yet. Please wait.');
                return;
            }
            
            // Determine which input is active
            const activeTab = document.querySelector('.tab.active').getAttribute('data-tab');
            
            if (activeTab === 'text') {
                const text = newsText.value.trim();
                if (text === '') {
                    showError('Please enter some text to analyze');
                    return;
                }
                analyzeContent(text);
            } else {
                const url = articleUrl.value.trim();
                if (url === '') {
                    showError('Please enter a URL to analyze');
                    return;
                }
                if (!isValidUrl(url)) {
                    showError('Please enter a valid URL');
                    return;
                }
                analyzeContent(url);
            }
        });
    }

    // Function to analyze content
    function analyzeContent(content) {
        // Show loading state
        showLoader();
        hideError();
        hideResults();
        
        // Simulate API call or model inference
        setTimeout(() => {
            hideLoader();
            
            // In a real app, you would use your loaded model here
            // For example:
            // const prediction = window.model.predict(preprocessContent(content));
            
            // For demo purposes, we'll simulate results
            const isFake = Math.random() > 0.5;
            const fakeConfidence = (Math.random() * 50 + 50).toFixed(2);
            const realConfidence = (100 - fakeConfidence).toFixed(2);
            
            // Display results
            displayResults(isFake, realConfidence, fakeConfidence);
        }, 2000);
    }

    // Display results
    function displayResults(isFake, realConfidence, fakeConfidence) {
        predictionText.textContent = isFake ? 'Fake News' : 'Real News';
        predictionText.className = 'value ' + (isFake ? 'fake' : 'real');
        confidenceValue.textContent = (isFake ? fakeConfidence : realConfidence) + '%';
        
        realProb.textContent = realConfidence + '%';
        fakeProb.textContent = fakeConfidence + '%';
        
        realFill.style.width = realConfidence + '%';
        fakeFill.style.width = fakeConfidence + '%';
        
        results.classList.remove('hidden');
    }

    // Model status functions
    function hideModelStatus() {
        modelStatus.classList.add('hidden');
    }

    function enableAnalyzeButton() {
        analyzeBtn.disabled = false;
    }

    // Helper functions
    function showError(message) {
        errorDiv.querySelector('#error-message').textContent = message;
        errorDiv.classList.remove('hidden');
    }

    function hideError() {
        errorDiv.classList.add('hidden');
    }

    function showLoader() {
        loader.classList.remove('hidden');
        analyzeBtn.disabled = true;
    }

    function hideLoader() {
        loader.classList.add('hidden');
        analyzeBtn.disabled = false;
    }

    function hideResults() {
        results.classList.add('hidden');
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
});