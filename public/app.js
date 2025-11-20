// Check model status on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (data.status === 'healthy' && data.model_loaded) {
            // Model is loaded, enable the button
            document.getElementById('analyze-btn').disabled = false;
        } else {
            // Show warning if model is not loaded
            document.getElementById('model-status').classList.remove('hidden');
            document.getElementById('analyze-btn').disabled = true;
        }
    } catch (error) {
        console.error('Error checking model status:', error);
        document.getElementById('model-status').classList.remove('hidden');
        document.getElementById('analyze-btn').disabled = true;
    }
    
    // Initialize the rest of the UI
    initUI();
});

function initUI() {
    // Tabs
    const tabs = document.querySelectorAll(".tab");
    const textInputGroup = document.getElementById("text-input");
    const urlInputGroup = document.getElementById("url-input");

    // UI elements
    const analyzeBtn = document.getElementById("analyze-btn");
    const errorBox = document.getElementById("error");
    const errorMsg = document.getElementById("error-message");
    const loader = document.getElementById("loader");
    const results = document.getElementById("results");

    // Results elements
    const predictionText = document.getElementById("prediction-text");
    const confidenceValue = document.getElementById("confidence-value");
    const realProb = document.getElementById("real-prob");
    const fakeProb = document.getElementById("fake-prob");
    const realFill = document.getElementById("real-fill");
    const fakeFill = document.getElementById("fake-fill");

    // Switch Tabs
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            const selected = tab.dataset.tab;

            if (selected === "text") {
                textInputGroup.classList.add("active");
                urlInputGroup.classList.remove("active");
            } else {
                textInputGroup.classList.remove("active");
                urlInputGroup.classList.add("active");
            }
        });
    });

    // Analyze button
    analyzeBtn.addEventListener("click", () => {
        const activeTab = document.querySelector(".tab.active").dataset.tab;

        if (activeTab === "text") {
            analyzeText();
        } else {
            analyzeURL();
        }
    });

    // Analyze TEXT
    function analyzeText() {
        const text = document.getElementById("news-text").value.trim();

        if (!text) return showError("Please enter some text to analyze.");

        sendRequest({ text: text });
    }

    // Analyze URL
    function analyzeURL() {
        const url = document.getElementById("article-url").value.trim();
        if (!url) return showError("Please enter a URL.");
        if (!isValidUrl(url)) return showError("Please enter a valid URL.");

        // For URL analysis, we would need to extract text from the URL
        // This is a placeholder - you'd need to implement this functionality
        showError("URL analysis is not implemented in this demo. Please use the text tab.");
    }

    // Send request to backend API
    async function sendRequest(payload) {
        // Reset UI
        hideError();
        results.classList.add("hidden");
        loader.classList.remove("hidden");

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (data.status !== "success") {
                showError(data.error || "An unknown error occurred.");
                return;
            }
            
            displayResults(data);
        } catch (error) {
            showError("Failed to analyze. Please try again.");
            console.error("API Error:", error);
        } finally {
            loader.classList.add("hidden");
        }
    }

    // Display results
    function displayResults(data) {
        predictionText.textContent = data.prediction;
        confidenceValue.textContent = `${data.confidence}%`;

        realProb.textContent = `${data.real_probability}%`;
        fakeProb.textContent = `${data.fake_probability}%`;

        realFill.style.width = `${data.real_probability}%`;
        fakeFill.style.width = `${data.fake_probability}%`;

        predictionText.className = "value";
        predictionText.classList.add(
            data.prediction === "Real News" ? "real" : "fake"
        );

        results.classList.remove("hidden");
        results.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Error handling
    function showError(msg) {
        errorMsg.textContent = msg;
        errorBox.classList.remove("hidden");
        errorBox.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function hideError() {
        errorBox.classList.add("hidden");
    }

    // Validate URL
    function isValidUrl(str) {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    }
}