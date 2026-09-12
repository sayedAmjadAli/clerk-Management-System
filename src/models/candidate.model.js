import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    position: { type: String, required: true, trim: true },
    candidates: [
      {
        name: { type: String, required: true, trim: true },
        profile: { type: String, required: true }, // Stores filename (e.g. "image-1710000.jpg")
      },
    ],
  },
  { timestamps: true }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);