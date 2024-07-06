const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
    model: "gemini-pro",
    geminiConfig,
});

/**
 * 
 * @param {string} question 
 * @returns 
 */
const generate = async (question) => {
    try {
        const result = await geminiModel.generateContent(question);
        const response = result.response;
        return {
            error: false,
            response: response.text(),
        }
    } catch (error) {
        console.error(error);
        return {
            error: true,
            response: "An error occurred while generating content",
        }
    }
};

module.exports = { generate, init };