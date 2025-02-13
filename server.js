const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const geminiRoutes = require("./src/routes/geminiRoutes");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json()); 

app.use("/api/gemini", geminiRoutes);

app.use(errorHandler);

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});