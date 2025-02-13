const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing. Please set it in your .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

console.log("✅ Gemini API Key loaded successfully.");

module.exports = genAI;
