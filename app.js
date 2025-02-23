const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const geminiRoutes = require("./src/routes/geminiRoutes");
const authRoutes = require("./src/routes/authRoutes");
const connectDB = require("./src/config/db");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/gemini", geminiRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;
