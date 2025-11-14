import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import foodRoutes from "./routes/foodRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", foodRoutes);
app.use("/feedback", feedbackRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/food_feedback_app")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
