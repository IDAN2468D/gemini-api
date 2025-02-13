const express = require("express");
const { generateText, analyzeImage, multimodalAnalysis, botResponse } = require("../controllers/geminiController");
const { upload, validateImage } = require("../middleware/validateImage");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

// ניתוח טקסט
router.post("/generate", validateRequest, generateText);

// ניתוח תמונה
router.post("/analyze-image", upload.single("image"), validateImage, analyzeImage);

// ניתוח רב-מודאלי
router.post("/multimodal", upload.single("image"), validateImage, multimodalAnalysis);

// מודל בוט שמגיב על שאלות טקסט
router.post("/bot-response", validateRequest, botResponse);

module.exports = router;