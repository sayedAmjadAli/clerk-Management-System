import mongoose from "mongoose";
import { Fee } from "../models/Fee.model.js";
import { ApiError } from "../utlis/ApiError.js";
import { Student } from "../models/student.model.js";

const addFees = async (req, res, next) => {
  const { studentId, semester, amount, challanNo, paymentDate } = req.body;

  if (!studentId || !semester || !amount || !challanNo || !paymentDate) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const findStudent = await Student.findOne({ _id: studentId });
    if (!findStudent) {
      return next(new ApiError(400, "Student Not Found"));
    }
    const exitsSemesterFees = await Fee.findOne({
      $and: [{ student: studentId }, { semester }],
    });

    if (exitsSemesterFees) {
      return next(new ApiError(400, "Student Already Paid this semester fees"));
    }

    const createFee = await Fee.create({
      student: studentId,
      amount,
      paymentDate,
      challanNo,
      semester,
      batch: findStudent?.batch,
    });

    res.status(201).json({ success: true, message: "Fees Added successfully" });
  } catch (error) {
    next(error);
  }
};

const getFeesByStudent = async (req, res, next) => {
  let { studentId } = req.params;
  studentId = new mongoose.Types.ObjectId(studentId);

  const fees = await Fee.aggregate([
    {
      $match: { student: studentId },
    },
    {
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $addFields: {
        student: { $arrayElemAt: ["$student", 0] },
      },
    },
  ]);

  res
    .status(200)
    .json({ success: true, message: "get fees by student id", fees });
};

const getFeesByBatch = async (req, res, next) => {
  let { batch } = req.params;
  batch = Number(batch);
  const fees = await Fee.aggregate([
    {
      $match: { batch },
    },
    {
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $addFields: {
        student: { $arrayElemAt: ["$student", 0] },
      },
    },
  ]);

  res.status(200).json({ success: true, message: "get fees by batch", fees });
};

export { addFees, getFeesByBatch, getFeesByStudent };
