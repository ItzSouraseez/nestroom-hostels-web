import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

/**
 * Compares two images using Gemini AI and returns a confidence score.
 * @param {string} profilePic - URL or base64 of the resident's profile picture
 * @param {string} capturedPhoto - Base64 data URL of the captured attendance photo
 * @returns {Promise<{confidence: number, isMatch: boolean, reason: string}>}
 */
export async function verifyResidentFace(profilePic, capturedPhoto) {
  const modelsToTry = [
    "gemini-1.5-flash", 
    "gemini-flash-latest",
    "gemini-1.5-pro", 
    "gemini-pro-vision"
  ];
  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

    // Helper to convert data URL or URL to the format Gemini expects (Browser compatible)
    const processImage = async (imgData) => {
      if (imgData.startsWith('http')) {
        const response = await fetch(imgData);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
              },
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        const base64Data = imgData.split(',')[1];
        return {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg",
          },
        };
      }
    };

    const img1 = await processImage(profilePic);
    const img2 = await processImage(capturedPhoto);

    const prompt = `
      Compare these two images:
      Image 1: The resident's official profile picture.
      Image 2: A live photo captured just now for attendance.

      Analyze if the person in both images is the same. 
      Consider facial features, bone structure, and overall appearance despite potential differences in lighting, background, or minor aging/facial hair.

      Return your response strictly in the following JSON format:
      {
        "confidence": <number between 0 and 100>,
        "isMatch": <boolean, true if confidence > 60>,
        "reason": "<a short explanation of your decision>"
      }
    `;

    const result = await model.generateContent([prompt, img1, img2]);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response if it contains markdown code blocks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
    } catch (error) {
      console.warn(`Model ${modelName} failed, trying next...`, error);
      lastError = error;
    }
  }

  console.error("All Gemini models failed:", lastError);
  throw new Error("Facial verification service is temporarily unavailable. Please try again later.");
}
