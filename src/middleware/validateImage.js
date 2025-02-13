const multer = require("multer");

// הגדרת אחסון קובץ זמני
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// בדיקה אם יש תמונה בבקשה
const validateImage = (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "❌ Image file is required." });
    }
    next();
};

// בדיקה אם יש טקסט בבקשה
const validateRequest = (req, res, next) => {
    if (!req.body.text) {
        return res.status(400).json({ error: "❌ Missing 'text' field in the request." });
    }
    next();
};

module.exports = { upload, validateImage, validateRequest };
