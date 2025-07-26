import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { apiKey, model, messages } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json({ error: "Model is required" }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
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
      return NextResponse.json(
        {
          error: "Bytez API error",
          message: responseText || "Failed to get response from Bytez API",
          status: response.status,
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Bytez response:", parseError);
      return NextResponse.json(
        {
          error: "Invalid response format",
          message: "Received invalid JSON from Bytez API",
        },
        { status: 500 }
      );
    }

    console.log("Successfully proxied Bytez API request");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Vercel API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
