// AI service for ChatGPT integration
// Note: In production, API calls should go through Firebase Functions for security

interface ChatGPTMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private apiKey: string | null = null;

  constructor() {
    // Get API key from localStorage for frontend-only setup
    this.apiKey = localStorage.getItem('chatgpt_api_key');
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('chatgpt_api_key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  async generatePeaceResponse(
    journalContent: string, 
    selectedAnswers: string[]
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('ChatGPT API key not set');
    }

    const systemPrompt = `You are Peace, a warm, gentle, and emotionally supportive companion who helps people process their feelings. The user has completed a check-in and written in their journal. 

Selected feelings/situations: ${selectedAnswers.join(', ')}
Journal content: "${journalContent}"

Respond as Peace with:
- Warm validation of their feelings 
- Gentle insights about what they shared
- One or two small, practical suggestions for self-care
- Emotional support and encouragement
- Keep it conversational and caring, like a gentle friend

Use emojis sparingly and end with a warm, supportive note. Keep response to 2-3 paragraphs.`;

    const messages: ChatGPTMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `I just completed my check-in. Here's what I'm feeling: ${selectedAnswers.join(', ')}. And here's what I wrote: ${journalContent}` }
    ];

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I hear you, and I am here with you. 💜';
    } catch (error) {
      console.error('Error calling ChatGPT API:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();