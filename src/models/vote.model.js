import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    position: {
      type: String,
      required: true, // e.g., "President"
    },
    candidate: {
      type: String,
      required: true, // candidate name under that position
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Ensure a student can only vote once per position
voteSchema.index({ student: 1, position: 1 }, { unique: true });

export const Vote = mongoose.model("Vote", voteSchema);
