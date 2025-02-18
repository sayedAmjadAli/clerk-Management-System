import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollno: { type: String, unique: true, required: true },
    batch: { type: String, required: true }, // e.g., "2020", "2021"
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  });

export  const  Student=mongoose.model('Student',studentSchema);
  