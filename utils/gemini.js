import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const geminiModel = "gemini-3-flash-preview";

export async function generateText(prompt) {

    const response = await ai.models.generateContent({
        model: geminiModel,
        contents: prompt,
    });

    return response.text ?? "生成できませんでした。";

}