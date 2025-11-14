import express from "express";
import Food from "../models/Food.js";

const router = express.Router();

// Admin login (simple password)
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === "admin123") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: "Invalid password" });
  }
});

// Add new food with duration (minutes)
router.post("/foods", async (req, res) => {
  const { name, duration } = req.body;
  const endTime = new Date(Date.now() + duration * 60000);
  const food = new Food({ name, endTime });
  await food.save();
  res.json(food);
});

// Get all foods (admin)
router.get("/admin/foods", async (req, res) => {
  const foods = await Food.find().sort({ startTime: -1 });
  res.json(foods);
});

// Close food manually
router.patch("/foods/:id/close", async (req, res) => {
  await Food.findByIdAndUpdate(req.params.id, { feedbackOpen: false });
  res.json({ success: true });
});

// Delete food
router.delete("/foods/:id", async (req, res) => {
  await Food.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Public: Get only active foods
router.get("/foods", async (req, res) => {
  const now = new Date();
  await Food.updateMany(
    { endTime: { $lt: now }, feedbackOpen: true },
    { feedbackOpen: false }
  );
  const activeFoods = await Food.find({ feedbackOpen: true });
  res.json(activeFoods);
});

export default router;
