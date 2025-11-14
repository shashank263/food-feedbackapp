import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  feedbackOpen: { type: Boolean, default: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
});

export default mongoose.model("Food", foodSchema);
