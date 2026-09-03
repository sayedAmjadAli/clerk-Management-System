import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    position: { type: String, required: true, trim: true }, // e.g., "President", "General Secretary"
    candidates: [
      {
        name: { type: String, required: true, trim: true },
      },
    ], // multiple candidates under same position
  },
  { timestamps: true }
);

export const Candidate = mongoose.model("Candidate", candidateSchema);
