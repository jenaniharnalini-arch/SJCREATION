import { GoogleGenAI } from "@google/genai";
import { VideoConfig } from '../types';

export const checkApiKeySelection = async (): Promise<boolean> => {
  if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptForApiKey = async (): Promise<void> => {
  if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
    await window.aistudio.openSelectKey();
  } else {
    console.error("AI Studio API Key selector not available.");
  }
};

export const generateVideo = async (config: VideoConfig): Promise<string> => {
  // Always create a new instance to get the latest injected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    let operation = await ai.models.generateVideos({
      model: config.model,
      prompt: config.prompt,
      config: {
        numberOfVideos: 1,
        resolution: config.resolution,
        aspectRatio: config.aspectRatio,
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
      console.log('Polling video generation status...');
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      throw new Error("No video URI returned from the operation.");
    }

    // Append API key to fetch the actual video blob
    const videoUrlWithKey = `${downloadLink}&key=${process.env.API_KEY}`;
    
    // Fetch the video content to ensure we have a playable blob/url that doesn't expire immediately or require auth headers in the video tag
    // Although for the video tag, we can usually use the URL directly if the key is appended.
    // Let's return the URL with the key.
    return videoUrlWithKey;

  } catch (error: any) {
    console.error("Video generation failed:", error);
    if (error.message && error.message.includes("Requested entity was not found")) {
      // This often means the key is invalid or not selected properly in this context
      throw new Error("API_KEY_INVALID");
    }
    throw error;
  }
};