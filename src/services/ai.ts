import { GoogleGenAI } from "@google/genai";

export class AIService {
  private static instance: AIService;
  private client: GoogleGenAI | null = null;
  private currentKey: string = '';

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public init(apiKey: string) {
    if (apiKey && apiKey !== this.currentKey) {
      console.log("AI Service initialized with active key");
      this.client = new GoogleGenAI({ apiKey });
      this.currentKey = apiKey;
    }
  }

  public async generateContent(prompt: string, model: string = "gemini-1.5-flash", apiKey?: string) {
    if (apiKey) {
      this.init(apiKey);
    }

    if (!this.client) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return `[SIMULATION MODE: NO API KEY DETECTED]\n\nPlease configure your Gemini API Key in the Settings panel to enable live neural processing.\n\nPrompt received: ${prompt}`;
    }

    try {
      const response = await this.client.models.generateContent({
        model: model,
        contents: prompt,
      });
      return response.text;
    } catch (error: any) {
      throw new Error(error.message || "Failed to generate content. Check network or API key.");
    }
  }
}

export const aiService = AIService.getInstance();
