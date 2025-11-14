import express from "express";
import Feedback from "../models/Feedback.js";

const router = express.Router();

// Get feedbacks for a food
router.get("/:foodId", async (req, res) => {
  const feedbacks = await Feedback.find({ foodId: req.params.foodId });
  res.json(feedbacks);
});

// Submit feedback
router.post("/:foodId", async (req, res) => {
  const { rating, comment } = req.body;
  const feedback = new Feedback({
    foodId: req.params.foodId,
    rating,
    comment,
  });
  await feedback.save();
  res.json({ success: true });
});

export default router;
