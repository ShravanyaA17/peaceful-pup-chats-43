// AI service for Bytez integration with Google Gemma
import Bytez from "bytez.js";

interface BytezMessage {
  role: "user" | "assistant";
  content: string;
}

interface QuestionAnswer {
  questionId: string;
  answer: "yes" | "no" | "maybe" | "";
}

export class AIService {
  private apiKey: string | null = null;
  private sdk: any = null;
  private isProduction: boolean = false;
  private renderApiUrl: string = "https://your-app-name.onrender.com"; // Update this after deployment

  constructor() {
    // Get API key from localStorage for frontend-only setup
    this.apiKey = localStorage.getItem("bytez_api_key");
    this.isProduction = window.location.hostname !== 'localhost';
    
    if (this.apiKey && !this.isProduction) {
      this.sdk = new Bytez(this.apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    this.isProduction = window.location.hostname !== 'localhost';
    
    if (!this.isProduction) {
      this.sdk = new Bytez(apiKey);
    }
    localStorage.setItem("bytez_api_key", apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private formatAnswersForAI(answers: QuestionAnswer[]): string {
    const questionMap = {
      water: "drinking enough water",
      food: "eating nourishing food",
      sleep: "sleeping well",
      unprepared: "feeling unprepared for upcoming things",
      argument: "having arguments or awkward moments",
      lingering: "having words/actions lingering in mind",
      judged: "worrying about falling behind or being judged",
      unwell: "feeling physically unwell or overstimulated",
      disconnected: "feeling disconnected from body or appearance",
      hormonal: "experiencing hormonal shifts",
      lonely: "feeling lonely or unseen",
    };

    const answeredQuestions = answers.filter((a) => a.answer !== "");
    const yesAnswers = answeredQuestions.filter((a) => a.answer === "yes");
    const noAnswers = answeredQuestions.filter((a) => a.answer === "no");
    const maybeAnswers = answeredQuestions.filter((a) => a.answer === "maybe");

    let summary = "";

    if (yesAnswers.length > 0) {
      summary += `Issues they're experiencing (YES): ${yesAnswers
        .map((a) => questionMap[a.questionId as keyof typeof questionMap])
        .join(", ")}. `;
    }

    if (noAnswers.length > 0) {
      summary += `Things that are going well (NO): ${noAnswers
        .map((a) => questionMap[a.questionId as keyof typeof questionMap])
        .join(", ")}. `;
    }

    if (maybeAnswers.length > 0) {
      summary += `Uncertain areas (MAYBE): ${maybeAnswers
        .map((a) => questionMap[a.questionId as keyof typeof questionMap])
        .join(", ")}. `;
    }

    return summary;
  }

  async generatePersonalReasonsResponse(
    personalReasons: string,
    selectedAnswers: QuestionAnswer[]
  ): Promise<string> {
    if (!this.apiKey) {
      console.info("No Bytez API key configured, using example response");
      return this.generateExamplePersonalResponse(personalReasons);
    }

    const answerSummary = this.formatAnswersForAI(selectedAnswers);

    const prompt = `You are Peace, a compassionate mental health companion. A person shared their personal thoughts about their anxiety. Give them SPECIFIC, ACTIONABLE solutions with minimal, tasteful emojis.

THEIR CHECK-IN RESPONSES:
${answerSummary}

THEIR PERSONAL THOUGHTS:
"${personalReasons}"

PROVIDE CONCRETE SOLUTIONS IN THIS FORMAT:

**Understanding Your Situation:** 🫂
Briefly acknowledge their specific concern in 1-2 sentences.

**Immediate Action Steps:** ✨
Give 3-4 SPECIFIC things they can do RIGHT NOW to address their exact concern. Be detailed and actionable.

**Why This Helps:** 💡
Explain briefly why these steps will help their specific situation.

IMPORTANT: 
- Use only 2-3 relevant emojis total
- Be SPECIFIC to their exact words and situation  
- Give concrete steps, not general advice
- Focus on immediate, doable actions

BE SPECIFIC. Give exact steps, not general advice. Focus on their exact words and situation.`;

    try {
      if (this.isProduction) {
        // Use Render API endpoint in production
        console.info("Calling Render API for personal reasons response...");
        
        const response = await fetch(`${this.renderApiUrl}/api/bytez`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: this.apiKey,
            model: "google/gemma-3-1b-it",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error("Render API error:", errorData);
          return this.generateExamplePersonalResponse(personalReasons);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || data.content || "";
        
        if (aiResponse.trim()) {
          console.info("Render API response received successfully");
          return aiResponse;
        } else {
          console.warn("Empty response from Render API, using fallback");
          return this.generateExamplePersonalResponse(personalReasons);
        }
      } else {
        // Use Bytez SDK directly in development (will fail due to CORS but has fallback)
        console.info("Calling Bytez API directly for personal reasons response...");
        
        const model = this.sdk.model("google/gemma-3-1b-it");
        const { error, output } = await model.run([
          {
            role: "user",
            content: prompt,
          },
        ]);

        if (error) {
          console.error("Bytez API error:", error);
          return this.generateExamplePersonalResponse(personalReasons);
        }

        if (output && output.trim()) {
          console.info("Bytez API response received successfully");
          return output;
        } else {
          console.warn("Empty response from Bytez API, using fallback");
          return this.generateExamplePersonalResponse(personalReasons);
        }
      }

    } catch (error) {
      console.error("Error calling AI API for personal reasons:", error);
      return this.generateExamplePersonalResponse(personalReasons);
    }
  }

  async generatePeaceResponse(
    journalContent: string,
    selectedAnswers: QuestionAnswer[]
  ): Promise<string> {
    if (!this.apiKey) {
      return this.generateFallbackResponse(selectedAnswers);
    }

    const answerSummary = this.formatAnswersForAI(selectedAnswers);
    const yesCount = selectedAnswers.filter((a) => a.answer === "yes").length;
    const anxietyLevel =
      yesCount > 6 ? "high" : yesCount > 3 ? "moderate" : "low";

    const prompt = `You are Peace, a warm, empathetic, and knowledgeable mental health companion. A person has completed a wellbeing check-in and you need to provide personalized support.

THEIR CHECK-IN RESULTS:
${answerSummary}
Anxiety level appears: ${anxietyLevel}
Journal entry: "${journalContent || "No journal entry provided"}"

PROVIDE A RESPONSE THAT INCLUDES:

1. **Warm Validation** (2-3 sentences): Acknowledge their feelings without judgment. Show you understand their experience.

2. **Gentle Insights** (2-3 sentences): Based on their specific answers, offer perspective on what might be contributing to how they're feeling.

3. **3-5 Micro-Tasks** - Provide specific, actionable suggestions based on their answers:
   - If they said YES to physical issues (water, food, sleep, unwell): suggest physical self-care
   - If they said YES to emotional issues (lingering thoughts, disconnected, lonely): suggest emotional regulation techniques
   - If they said YES to social issues (arguments, feeling unseen): suggest social connection activities
   - If they said YES to mental issues (unprepared, judged): suggest anxiety management techniques
   - For MAYBE answers: suggest gentle exploration activities
   - For NO answers: acknowledge what's going well

4. **Encouragement** (1-2 sentences): End with hope and remind them of their strength.

FORMAT: Use a caring, conversational tone. Include 1-2 relevant emojis total. Keep response to 3-4 paragraphs max.

EXAMPLE MICRO-TASKS BASED ON THEIR ANSWERS:
- "Try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste"
- "Set a timer for 10 minutes and drink a full glass of water slowly"
- "Write down 3 small things you can prepare for tomorrow to feel more ready"
- "Send a simple 'thinking of you' message to someone who makes you feel seen"
- "Take 5 deep breaths and place a hand on your heart"

Be specific and actionable, not generic.`;

    try {
      if (this.isProduction) {
        // Use Render API endpoint in production
        console.info("Calling Render API for general response...");
        
        const response = await fetch(`${this.renderApiUrl}/api/bytez`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            apiKey: this.apiKey,
            model: "google/gemma-3-1b-it",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          console.error("Render API error:", errorData);
          return this.generateFallbackResponse(selectedAnswers);
        }

        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || data.content || "";
        
        if (aiResponse.trim()) {
          console.info("Render API response received successfully");
          return aiResponse;
        } else {
          console.warn("Empty response from Render API, using fallback");
          return this.generateFallbackResponse(selectedAnswers);
        }
      } else {
        // Use Bytez SDK directly in development (will fail due to CORS but has fallback)
        console.info("Calling Bytez API directly for general response...");
        
        const model = this.sdk.model("google/gemma-3-1b-it");
        const { error, output } = await model.run([
          {
            role: "user",
            content: prompt,
          },
        ]);

        if (error) {
          console.error("Bytez API error:", error);
          return this.generateFallbackResponse(selectedAnswers);
        }

        if (output && output.trim()) {
          console.info("Bytez API response received successfully");
          return output;
        } else {
          console.warn("Empty response from Bytez API, using fallback");
          return this.generateFallbackResponse(selectedAnswers);
        }
      }

    } catch (error) {
      console.error("Error calling AI API:", error);
      return this.generateFallbackResponse(selectedAnswers);
    }
  }  private generateExamplePersonalResponse(personalReasons: string): string {
    const lowerReasons = personalReasons.toLowerCase();

    // Analyze the personal thoughts and provide specific solutions
    if (
      lowerReasons.includes("presentation") ||
      lowerReasons.includes("present")
    ) {
      return `**Understanding Your Situation:** 🎯
I can see you're worried about an upcoming presentation - that anticipation anxiety is so real and valid.

**Immediate Action Steps:** ✨
1. **Break it down**: Spend 15 minutes right now creating a simple outline with 3 main points
2. **Practice the opening**: Say your first two sentences out loud 5 times - this builds confidence
3. **Prepare your safety net**: Write 3 key points on a small card as backup
4. **Get physical ready**: Lay out your clothes and materials tonight so tomorrow feels smoother

**Why This Helps:** 💡
Taking small, concrete steps transforms overwhelming "presentation anxiety" into manageable tasks. Each completed step builds confidence and reduces the unknown factors that fuel worry.`;
    }

    if (
      lowerReasons.includes("conversation") ||
      lowerReasons.includes("overthinking") ||
      lowerReasons.includes("said")
    ) {
      return `**Understanding Your Situation:** 🫂
Replaying conversations in your mind is exhausting - your brain is trying to solve something it can't control.

**Immediate Action Steps:** ✨
1. **Brain dump**: Write down exactly what's bothering you about the conversation (2 minutes)
2. **Reality check**: Ask yourself "What would I tell a friend in this situation?"
3. **Take action OR let go**: Either send one clarifying text/call, or consciously choose to stop replaying it
4. **Break the loop**: Do 10 jumping jacks or splash cold water on your face when the thoughts return

**Why This Helps:** 💡
Overthinking keeps you stuck in mental loops. These steps either resolve the issue through action or train your brain to redirect energy toward things you can actually control.`;
    }

    if (
      lowerReasons.includes("work") ||
      lowerReasons.includes("deadline") ||
      lowerReasons.includes("behind")
    ) {
      return `**Understanding Your Situation:** 🫂
Work stress can feel overwhelming when everything seems urgent and you're not sure where to start.

**Immediate Action Steps:** ✨
1. **List what you control**: Write down 3 tasks you CAN control vs 3 you cannot
2. **Pick the smallest win**: Complete one 5-minute task right now to feel progress
3. **Ask for clarity**: Send ONE email asking for help or clarification on the biggest concern
4. **Time-box worry**: Set a 10-minute timer to worry about work, then consciously stop

**Why This Helps:** 💡
Separating controllable from uncontrollable reduces mental overwhelm. Small wins create momentum, and seeking clarity often reveals that problems are more manageable than they seemed.`;
    }

    if (
      lowerReasons.includes("friend") ||
      lowerReasons.includes("relationship") ||
      lowerReasons.includes("family")
    ) {
      return `**Understanding Your Situation:** 🫂
Relationship concerns can create a lot of mental noise because they involve factors outside our direct control.

**Immediate Action Steps:** ✨
1. **Clarify your feelings**: Write down exactly what you need from this relationship
2. **One small gesture**: Send a simple "thinking of you" message or suggest a specific plan to connect
3. **Set a boundary**: Decide what you will and won't accept, then communicate one clear boundary
4. **Focus on your part**: List what YOU can do differently, ignoring what they should do

**Why This Helps:** 💡
Relationship anxiety often comes from unclear expectations. Taking concrete action, even small steps, helps you feel empowered rather than helpless in the situation.`;
    }

    // Default response for other concerns
    return `**Understanding Your Situation:** 🫂
Thank you for sharing what's really on your mind. Your self-awareness about your specific concerns is actually a strength.

**Immediate Action Steps:** ✨
1. **Break it down**: Identify the smallest possible step you could take about this concern right now
2. **Set a boundary**: Decide how much mental energy you'll give this today, then stick to it
3. **Get grounded**: Name 5 things you can see, 4 you can touch, 3 you can hear right now
4. **Take one action**: Do ONE thing that moves you forward, even if it's tiny

**Why This Helps:** 💡
When anxiety feels vague and overwhelming, specific actions help your brain shift from worry-mode to problem-solving mode. You have more control than anxiety wants you to believe.`;
  }

  private generateFallbackResponse(selectedAnswers: QuestionAnswer[]): string {
    const yesAnswers = selectedAnswers.filter((a) => a.answer === "yes");
    const maybeAnswers = selectedAnswers.filter((a) => a.answer === "maybe");

    if (yesAnswers.length === 0 && maybeAnswers.length === 0) {
      return `**You're Doing Great! 🌟**

It sounds like you're taking good care of yourself right now. That's wonderful to see! Sometimes we check in expecting to find problems, but finding stability is equally valuable.

**Keep This Momentum:**
1. **Acknowledge your wins**: Take a moment to appreciate what's going well
2. **Maintain your routines**: Whatever you're doing is working - keep it up
3. **Stay connected**: Reach out to someone who makes you feel good
4. **Prepare for future**: When things are good, it's a great time to build resilience for later

Remember, mental health isn't just about fixing problems - it's about nurturing the good things too. ✨`;
    }

    const concernAreas = [];
    if (
      yesAnswers.some((a) =>
        ["water", "food", "sleep", "unwell", "hormonal"].includes(a.questionId)
      )
    ) {
      concernAreas.push("physical care");
    }
    if (
      yesAnswers.some((a) => ["unprepared", "judged"].includes(a.questionId))
    ) {
      concernAreas.push("mental preparation");
    }
    if (yesAnswers.some((a) => ["argument", "lonely"].includes(a.questionId))) {
      concernAreas.push("social connection");
    }
    if (
      yesAnswers.some((a) =>
        ["lingering", "disconnected"].includes(a.questionId)
      )
    ) {
      concernAreas.push("emotional processing");
    }

    return `**I See Where You Might Need Some Support 💜**

Based on your responses, it looks like ${concernAreas.join(
      " and "
    )} could use some gentle attention today.

**Immediate Comfort Steps:**
1. **Start with your body**: Drink some water, eat something nourishing, or take 5 deep breaths
2. **Ground yourself**: Name 3 things you can see, 2 you can hear, 1 you can touch
3. **One small action**: Pick the easiest thing you could do right now to feel 1% better
4. **Be kind to yourself**: You're doing the hard work of checking in - that takes courage

**Why This Matters:**
When multiple areas feel challenging, it's tempting to tackle everything at once. But small, gentle steps often create the most lasting change. You don't have to fix everything today. 🌱`;
  }
}

export const aiService = new AIService();
