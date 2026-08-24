require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const contactRoutes = require("./routes/contact");

const app = express();

app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
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

const PORT = process.env.PORT || 4000;

function start() {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
