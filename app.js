require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // ✅ You forgot to import this!
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes.js");
const fileRoutes = require("./routes/fileRoutes.js");
// Start server
const PORT = process.env.PORT || 5000;

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB connection established successfully"))
  .catch((err) => console.error("Error connecting to DB", err));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(express.json());
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

// Serve static React files
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
