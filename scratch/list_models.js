import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    // We can list models using a fetch request or by calling the API if supported
    // But since listModels might need GoogleGenAI, let's try calling the models endpoint directly via fetch
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const list = data.models || [];
    const geminiModels = list.filter(m => m.name.includes("gemini") && m.supportedGenerationMethods.includes("generateContent"));
    console.log("Gemini models count:", geminiModels.length);
    console.log("Model names:", geminiModels.map(m => m.name));
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
