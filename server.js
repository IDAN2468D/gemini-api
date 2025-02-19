const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const geminiRoutes = require("./src/routes/geminiRoutes");
const authRoutes = require('./src/routes/authRoutes'); 
const connectDB = require('./src/config/db.js'); // חיבור למסד נתונים

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // ודא שחיבור מסד הנתונים לא נכשל

app.use(cors());
app.use(express.json()); 

app.use("/api/gemini", geminiRoutes);
app.use('/api/auth', authRoutes);

// מאזין אך ורק לפורט
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
