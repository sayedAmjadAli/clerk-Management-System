import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  class: { type: String, required: true },   // e.g., "10th", "BSCS"
  section: { type: String, required: true }, // e.g., "A", "B"
  voteNumber: { type: String, unique: true, required: true }, // unique number for voting
});

export const Student = mongoose.model("Student", studentSchema);
