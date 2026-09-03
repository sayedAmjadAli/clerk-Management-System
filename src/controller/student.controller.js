import mongoose from "mongoose";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utlis/ApiError.js";

// Register a new student
const register = async (req, res, next) => {
  const { username, class: studentClass, section, voteNumber } = req.body;

  // Validate required fields
  if ([username, studentClass, section, voteNumber].some(item => !item || item.trim() === "")) {
    return next(new ApiError(400, "All fields are required"));
  }

  // Check if voteNumber already exists
  const existingStudent = await Student.findOne({ voteNumber });
  if (existingStudent) {
    return next(new ApiError(400, "This vote number is already assigned"));
  }

  try {
    const student = await Student.create({ username, class: studentClass, section, voteNumber });

    if (!student) {
      return next(new ApiError(400, "Error while creating student"));
    }

    res.status(201).json({ message: "Student Registered Successfully", student });
  } catch (error) {
    next(error);
  }
};

// Get all students
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();

    if (!students || students.length === 0) {
      return next(new ApiError(404, "No students found"));
    }

    res.status(200).json({ success: true, message: "Successfully retrieved all students", students });
  } catch (error) {
    next(error);
  }
};

// Get students by class
const getStudentsByClass = async (req, res, next) => {
  const { class: studentClass } = req.params;

  try {
    const students = await Student.find({ class: studentClass });

    if (!students || students.length === 0) {
      return next(new ApiError(404, "No students found for this class"));
    }

    res.status(200).json({ success: true, message: "Successfully retrieved students by class", students });
  } catch (error) {
    next(error);
  }
};

// Get student by voteNumber
const getStudentByVoteNumber = async (req, res, next) => {
  const { voteNumber } = req.params;

  try {
    const student = await Student.findOne({ voteNumber });

    if (!student) {
      return next(new ApiError(404, "No student found with this vote number"));
    }

    res.status(200).json({ success: true, message: "Successfully retrieved student by vote number", student });
  } catch (error) {
    next(error);
  }
};

// Update student
const updateStudent = async (req, res, next) => {
  const { username, class: studentClass, section, voteNumber } = req.body;
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ApiError(404, "Student not found with this id"));
    }

    student.username = username || student.username;
    student.class = studentClass || student.class;
    student.section = section || student.section;
    student.voteNumber = voteNumber || student.voteNumber;

    await student.save();
    res.status(200).json({ success: true, message: "Student updated successfully", student });
  } catch (error) {
    next(error);
  }
};

// Delete student
const deleteStudent = async (req, res, next) => {
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ApiError(404, "Student not found with this id"));
    }

    await Student.deleteOne({ _id: studentId });
    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  getStudents,
  getStudentsByClass,
  getStudentByVoteNumber,
  updateStudent,
  deleteStudent,
};
