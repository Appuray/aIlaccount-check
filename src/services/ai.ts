// import { GoogleGenAI } from "@google/genai";

export class AIService {
  private static instance: AIService;
  // private client: any = null;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public init(apiKey: string) {
    console.log("AI Service initialized with key:", apiKey.substring(0, 8) + "...");
    // this.client = new GoogleGenAI({ apiKey });
  }

  public async generateContent(prompt: string, model: string = "gemini-2.0-flash") {
    // Simulation mode
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `[SIMULATED RESPONSE] This is a simulated response for the model: ${model}. \n\nPrompt received: ${prompt}`;
  }
}

export const aiService = AIService.getInstance();
