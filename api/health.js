// api/health.js
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error', 
      error: 'Method not allowed. Only GET requests are accepted.' 
    });
  }

  try {
    // In a real application, you would check if your ML model is loaded here
    // For demonstration purposes, we'll simulate a model check
    const isModelLoaded = checkIfModelLoaded();
    
    // Get system information
    const systemInfo = getSystemInfo();
    
    // Return health status
    res.status(200).json({
      status: 'healthy',
      model_loaded: isModelLoaded,
      timestamp: new Date().toISOString(),
      service: 'Fake News Detector API',
      version: '1.0.0',
      system: systemInfo
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      error: 'Internal server error during health check',
      timestamp: new Date().toISOString()
    });
  }
};

// Simulate model loading check
function checkIfModelLoaded() {
  // In a real application, you would check if your ML model is properly loaded
  // This could involve checking if model files exist, if the model is initialized, etc.
  
  // For demo purposes, we'll return true 90% of the time
  return Math.random() > 0.1;
}

// Get system information
function getSystemInfo() {
  return {
    node_version: process.version,
    platform: process.platform,
    memory_usage: process.memoryUsage(),
    uptime: process.uptime()
  };
}