
import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

// Fix: Initialize GoogleGenAI correctly with the apiKey property and follow coding guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeInspectionTasks = async (tasks: Task[]): Promise<string> => {
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

    // Fix: Use gemini-3-flash-preview for basic text analysis tasks as per guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    // Fix: Use .text property directly
    return response.text || "Analysis failed to generate text.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI analysis service is temporarily unavailable.";
  }
};
