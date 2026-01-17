import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client.
// Note: In a real production app, ensure API keys are not exposed to the client if possible, 
// or use a proxy. For this demo, we assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateAIResponse = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // We can use a chat session if we want to maintain history easily, 
    // or just single generation calls. For a simple assistant, chats.create is best.
    const chat = ai.chats.create({
      model: model,
      history: history,
      config: {
        systemInstruction: "You are Scorpion AI, a helpful and efficient assistant for Scorpion Systems employees. You help with code, productivity, and general queries.",
      }
    });

    const result: GenerateContentResponse = await chat.sendMessage({ message: prompt });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I am having trouble connecting to the Scorpion Systems AI mainframe.";
  }
};
