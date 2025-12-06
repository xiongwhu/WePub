
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTitle } from '../types';

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is set securely.

// Initialize Gemini client
const ai = new GoogleGenAI({ apiKey });

export const generateTitles = async (content: string): Promise<GeneratedTitle[]> => {
  if (!content) return [];

  const prompt = `
    Based on the following article content, generate 5 catchy, SEO-friendly titles suitable for a WeChat Official Account (公众号).
    The titles should be engaging and clickable. Return the result in JSON format.
    
    Article Content:
    ${content.substring(0, 3000)}... (truncated)
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "The generated title" },
              rationale: { type: Type.STRING, description: "Why this title works" }
            },
            required: ["title", "rationale"]
          }
        }
      }
    });

    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr) as GeneratedTitle[];
  } catch (error) {
    console.error("Error generating titles:", error);
    throw error;
  }
};

export const generateSummary = async (content: string): Promise<string> => {
  if (!content) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Summarize the following article in about 120 Chinese characters. 
        The summary is for the WeChat Official Account metadata description.
        Make it intriguing to encourage reading.

        Article Content:
        ${content.substring(0, 5000)}
      `
    });
    return response.text || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};

export const polishContent = async (content: string): Promise<string> => {
  if (!content) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        You are a professional editor for a top-tier tech blog. 
        Proofread and improve the flow of the following Markdown content. 
        Fix typos, improve clarity, and make the tone professional yet accessible. 
        Keep the Markdown format intact. Do not change the meaning.
        
        Content:
        ${content}
      `
    });
    return response.text || content;
  } catch (error) {
    console.error("Error polishing content:", error);
    throw error;
  }
};

export const generateImagePrompt = async (content: string): Promise<string> => {
  if (!content) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Based on the following article content, write a detailed text-to-image prompt to generate a cover image.
        
        Style requirements: "Flat vector illustration, modern, minimalist, vibrant colors, suitable for tech or lifestyle blog cover".
        
        Task: 
        1. Analyze the core theme of the article.
        2. Describe a visual scene that represents this theme.
        3. Keep the prompt descriptive but concise (under 80 words).
        4. Return ONLY the prompt text in Chinese (or English if better for image generation, but Chinese is preferred for user readability).

        Article Content:
        ${content.substring(0, 3000)}
      `
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error generating image prompt:", error);
    throw error;
  }
};

export const generateCoverImage = async (prompt: string): Promise<string> => {
  if (!prompt) return "";

  try {
    // Using gemini-2.5-flash-image with proper image configuration
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Generate a flat vector illustration style cover image for a blog post. Aspect ratio 16:9. Subject: ${prompt}` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Model returned no candidates. This might be due to safety filters.");
    }

    for (const part of response.candidates[0].content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    // Check if the model returned text instead (refusal or misunderstanding)
    const textPart = response.candidates[0].content?.parts?.find(p => p.text)?.text;
    if (textPart) {
      console.warn("Model response (text):", textPart);
      throw new Error(`Model returned text instead of image: ${textPart.substring(0, 50)}...`);
    }

    throw new Error("No image data returned from model.");

  } catch (error) {
    console.error("Error generating cover image:", error);
    throw error;
  }
};
