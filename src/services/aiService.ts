// AI service for Bytez integration with Google Gemma
import Bytez from "bytez.js";

interface BytezMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class AIService {
  private apiKey: string | null = null;
  private sdk: any = null;

  constructor() {
    // Get API key from localStorage for frontend-only setup
    this.apiKey = localStorage.getItem('bytez_api_key');
    if (this.apiKey) {
      this.sdk = new Bytez(this.apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.sdk = new Bytez(apiKey);
    localStorage.setItem('bytez_api_key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generatePeaceResponse(
    journalContent: string, 
    selectedAnswers: string[]
  ): Promise<string> {
    if (!this.sdk || !this.apiKey) {
      throw new Error('Bytez API key not set');
    }

    const prompt = `You are Peace, a warm, gentle, and emotionally supportive companion who helps people process their feelings. The user has completed a check-in and written in their journal.

Selected feelings/situations: ${selectedAnswers.join(', ')}
Journal content: "${journalContent}"

Respond as Peace with:
- Warm validation of their feelings 
- Gentle insights about what they shared
- One or two small, practical suggestions for self-care
- Emotional support and encouragement
- Keep it conversational and caring, like a gentle friend

Use emojis sparingly and end with a warm, supportive note. Keep response to 2-3 paragraphs.

User's check-in: I'm feeling ${selectedAnswers.join(', ')}. ${journalContent ? `I wrote: ${journalContent}` : ''}`;

    try {
      const model = this.sdk.model("google/gemma-3-1b-it");
      const { error, output } = await model.run([
        {
          role: "user",
          content: prompt
        }
      ]);

      if (error) {
        throw new Error(`Bytez API error: ${error}`);
      }

      return output || 'I hear you, and I am here with you. 💜';
    } catch (error) {
      console.error('Error calling Bytez API:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();