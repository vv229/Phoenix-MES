import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeInspectionTasks = async (tasks: Task[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key not configured. Unable to perform AI analysis. Please set process.env.API_KEY.";
  }

  try {
    const prompt = `
      You are an expert Manufacturing Execution System (MES) assistant.
      Analyze the following FQC (Final Quality Control) inspection tasks.
      
      Tasks Data:
      ${JSON.stringify(tasks)}

      Please provide a concise summary in Chinese (Markdown format) covering:
      1. Current workload status (Busy/Normal/Idle).
      2. Identify any potential bottlenecks (e.g., specific lines or inspectors with high load).
      3. Highlight any quality risks based on the task data (e.g., high priority pending items).
      4. Suggest a specific action for the supervisor.

      Keep the tone professional and concise.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Analysis failed to generate text.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI analysis service is temporarily unavailable.";
  }
};