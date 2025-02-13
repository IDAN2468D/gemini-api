const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY is missing. Please set it in your .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// הגדרת אפשרויות הגנרציה
const generationConfig = {
    temperature: 0.7,
    topP: 1,
    topK: 40,
    maxOutputTokens: 4096
};

// הגדרת המודלים של גוגל גנרטיב
const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig });
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig });
const multimodalModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig });

// ניתוח טקסט בלבד
async function generateText(req, res, next) {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "❌ Missing 'prompt' field in the request." });
        }

        const result = await textModel.generateContent(prompt);
        return res.json({ text: result.response.text() });
    } catch (error) {
        console.error("Text Generation Error:", error);
        return res.status(500).json({ error: "❌ Internal Server Error" });
    }
}

// ניתוח תמונה
async function analyzeImage(req, res, next) {
    try {
        const imageBase64 = req.file.buffer.toString("base64");

        const parts = [
            { text: "Describe what is happening in this image:" },
            {
                inlineData: {
                    mimeType: req.file.mimetype,
                    data: imageBase64
                }
            }
        ];

        const result = await visionModel.generateContent({ contents: [{ role: "user", parts }] });
        console.log("Image Response:", result.response.text());
        const response = await result.response;

        return res.json({ description: response.text() });
    } catch (error) {
        console.error("Image Analysis Error:", error);
        next(error);
    }
}

// ניתוח רב-מודאלי (טקסט ותמונה)
async function multimodalAnalysis(req, res, next) {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    try {
        const text = req.body.text;
        const imageBase64 = req.file ? req.file.buffer.toString("base64") : null;

        if (!text || !imageBase64) {
            return res.status(400).json({ error: "❌ Missing 'text' or 'image' field in the request." });
        }

        // בדיקת גודל קובץ
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (req.file.size > MAX_SIZE) {
            return res.status(400).json({ error: "❌ File size is too large." });
        }

        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ error: "❌ Invalid file type." });
        }

        const parts = [
            { text: text },
            {
                inlineData: {
                    mimeType: req.file.mimetype,
                    data: imageBase64
                }
            }
        ];

        const result = await multimodalModel.generateContent({ contents: [{ role: "user", parts }] });
        console.log("Multimodal Response:", result.response.text());
        const response = await result.response;

        return res.json({ analysis: response.text() });
    } catch (error) {
        console.error("Multimodal Analysis Error:", error);
        next(error);
    }
}

// מודל בוט שמגיב על שאלות טקסט
let conversationHistory = []; // נשמור את ההיסטוריה של השיחה

async function botResponse(req, res, next) {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "❌ Missing 'message' field in the request." });
        }

        // הוספת ההודעה להיסטוריית השיחה
        conversationHistory.push({ role: "user", content: prompt });

        // בנה את prompt לדיאלוג
        const botPrompt = conversationHistory.map((entry) => `${entry.role}: ${entry.content}`).join("\n");

        // השאר את ה- bot לאותן קונפיגורציות
        const result = await textModel.generateContent(botPrompt);

        // הוספת תשובת הבוט להיסטוריה
        conversationHistory.push({ role: "bot", content: result.response.text() });

        return res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Bot Response Error:", error);
        return res.status(500).json({ error: "❌ Internal Server Error" });
    }
}

module.exports = { generateText, analyzeImage, multimodalAnalysis, botResponse };
