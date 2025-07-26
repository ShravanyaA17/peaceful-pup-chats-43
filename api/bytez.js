// Vercel Serverless Function for Bytez API Proxy
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { apiKey, model, messages } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        error: "API key is required",
        message: "Please provide a valid Bytez API key",
      });
    }

    if (!model) {
      return res.status(400).json({
        error: "Model is required",
        message: "Please specify which AI model to use",
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Messages are required",
        message: "Please provide an array of messages",
      });
    }

    console.log(`Making request to Bytez API with model: ${model}`);

    // Make the request to Bytez API
    const response = await fetch(`https://api.bytez.com/models/v2/${model}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": "Peaceful-Pup-Vercel/1.0",
      },
      body: JSON.stringify({
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const responseText = await response.text();
    console.log(`Bytez API response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Bytez API error: ${responseText}`);
      return res.status(response.status).json({
        error: "Bytez API error",
        message: responseText || "Failed to get response from Bytez API",
        status: response.status,
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Bytez response:", parseError);
      return res.status(500).json({
        error: "Invalid response format",
        message: "Received invalid JSON from Bytez API",
      });
    }

    console.log("Successfully proxied Bytez API request");
    return res.json(data);
  } catch (error) {
    console.error("Vercel API error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message || "Failed to process request",
    });
  }
}
