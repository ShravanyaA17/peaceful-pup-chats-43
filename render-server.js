// Render.com API endpoint for Bytez proxy
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (Render handles HTTPS automatically)
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Peaceful Pup API is running on Render!',
    endpoints: ['/api/bytez']
  });
});

// Bytez proxy endpoint
app.post('/api/bytez', async (req, res) => {
  try {
    const { apiKey, model, messages } = req.body;

    if (!apiKey) {
      return res.status(400).json({ 
        error: 'API key is required',
        message: 'Please provide a valid Bytez API key'
      });
    }

    if (!model) {
      return res.status(400).json({ 
        error: 'Model is required',
        message: 'Please specify which AI model to use'
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: 'Messages are required',
        message: 'Please provide an array of messages'
      });
    }

    console.log(`Making request to Bytez API with model: ${model}`);
    
    // Make the request to Bytez API
    const response = await fetch(`https://api.bytez.com/models/v2/${model}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Peaceful-Pup-Render/1.0'
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        uid: "peaceful-pup-user-" + Date.now() // Generate unique user ID
      })
    });

    const responseText = await response.text();
    console.log(`Bytez API response status: ${response.status}`);
    
    if (!response.ok) {
      console.error(`Bytez API error: ${responseText}`);
      return res.status(response.status).json({
        error: 'Bytez API error',
        message: responseText || 'Failed to get response from Bytez API',
        status: response.status
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Bytez response:', parseError);
      return res.status(500).json({
        error: 'Invalid response format',
        message: 'Received invalid JSON from Bytez API'
      });
    }

    console.log('Successfully proxied Bytez API request');
    res.json(data);

  } catch (error) {
    console.error('Render API error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to process request'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: ['/', '/api/bytez']
  });
});

app.listen(PORT, () => {
  console.log(`🐕 Peaceful Pup API running on Render at port ${PORT}`);
  console.log(`📡 CORS enabled for all origins`);
  console.log(`🔗 Health check available at: /`);
  console.log(`🤖 Bytez proxy available at: /api/bytez`);
});
