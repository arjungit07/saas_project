// TS: geminiai.ts
import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/promts";

// Initialize Gemini client (ensure apiKey is configured, often via environment variable)
const ai = new GoogleGenAI({});

export const generateSummaryFromGemini = async (pdfText: string): Promise<any> => {
    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            config: {
                temperature: 0.7,
                maxOutputTokens: 1500,
            },
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: SUMMARY_SYSTEM_PROMPT },
                        {
                            text: `Transform this document into an engaging, easy-to-read summary with contextually relevant emojis and proper markdown formatting:\n\n${pdfText}`,
                        },
                    ],
                },
            ],
        });

        return result.text;

    } catch (error: any) {
        if (error.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }
        console.error("Gemini API Error:", error);
        throw error;
    }
};