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
    type: {
      type: String,
      enum: ["idea", "action"],
      default: "idea",
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    source: {
      type: String,
      default: "Added content",
    },
    category: {
      type: String,
      default: "General",
    },
    liked: {
      type: Boolean,
      default: false,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    relatedIdeaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model("Content", contentSchema);
