const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("StudyBuddy Backend is Working!");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studybuddy";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:");
    console.error(error.message);
  });