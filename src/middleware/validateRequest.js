function validateRequest(req, res, next) {
    if (!req.body.prompt) {
        return res.status(400).json({ error: "❌ Missing required 'prompt' field." });
    }
    next();
}

module.exports = validateRequest;