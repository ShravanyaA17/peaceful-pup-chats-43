const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your frontend
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Peaceful Pup Backend is running!' });
});

// Proxy endpoint for Bytez API
app.post('/api/bytez/chat', async (req, res) => {
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
        'User-Agent': 'Peaceful-Pup-Backend/1.0'
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7
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
    console.error('Backend error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Failed to process request'
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist'
  });
});

app.listen(PORT, () => {
  console.log(`🐕 Peaceful Pup Backend running on port ${PORT}`);
  console.log(`📡 CORS enabled for frontend development servers`);
  console.log(`🔗 Health check available at: http://localhost:${PORT}/health`);
});
