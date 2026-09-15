require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contact");
const recruitmentRoutes = require("./routes/recruitment");

const app = express();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("MONGODB_URI environment variable is missing.");
}


app.use(helmet());
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://kiitnexus.in",
  "https://www.kiitnexus.in"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        /\.vercel\.app$/.test(origin) ||
        origin.endsWith("kiitnexus.in");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Basic rate limiting to prevent spam
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

app.use("/api", contactRoutes);
app.use("/api/recruitments", recruitmentRoutes);

const PORT = process.env.PORT || 4000;

// Export the Express app for Vercel Serverless Functions compatibility
module.exports = app;

// Only start the listener when running locally, not under Vercel Serverless Functions
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
