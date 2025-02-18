import mongoose from "mongoose";

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester: { type: Number, min: 1, max: 8, required: true },
  amount: { type: Number, required: true },
  challanNo: { type: String,  required: true },
  paymentDate: { type: String,required: true },
  batch:{ type: Number, required: true}
});




export  const  Fee=mongoose.model('Fee', feeSchema);
  