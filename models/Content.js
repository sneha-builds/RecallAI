import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Untitled",
    },
    originalContent: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      default: "Generated summary...",
    },
    insight: {
      type: String,
      default: "Generated insight...",
    },
    action: {
      type: String,
      default: "Take action today!",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model("Content", contentSchema);
