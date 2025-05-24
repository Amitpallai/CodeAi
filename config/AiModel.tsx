import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from '@google/generative-ai';
  
  // Validate API key
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable');
  }
  
  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Configure the model
  const model = genAI.getGenerativeModel({
    model: 'gemini-pro',
  });
  
  // Configure generation settings
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
  };
  
  // Configure safety settings
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  
  // Initialize chat sessions
  export const chatSession = model.startChat({
    generationConfig,
    safetySettings,
    history: [],
  });
  
  export const GenAiCode = model.startChat({
    generationConfig: {
      ...generationConfig,
      responseMimeType: 'application/json',
    },
    safetySettings,
    history: [],
  });
  
  // Helper function to generate content
  export const generateContent = async (chat: any, prompt: string) => {
    try {
      if (!prompt) {
        throw new Error('Prompt is required');
      }

      const result = await chat.sendMessage(prompt);
      if (!result || !result.response) {
        throw new Error('Invalid response from AI model');
      }

      return result.response;
    } catch (error) {
      console.error('Error generating content:', error);
      if (error instanceof Error) {
        throw new Error(`AI generation failed: ${error.message}`);
      }
      throw new Error('Unknown error occurred during AI generation');
    }
  };
  
  //   const result = await chatSession.sendMessage('INSERT_INPUT_HERE');
  //   console.log(result.response.text());