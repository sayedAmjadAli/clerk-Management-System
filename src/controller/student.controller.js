import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Student } from "../models/student.model.js";
import { ApiError } from "../utlis/ApiError.js";

// Register a new student
const register = async (req, res, next) => {
  const { username, fatherName, password, class: studentClass, section, voteNumber } = req.body;

  // Validate required fields
  if (
    [username, fatherName, password, studentClass, section, voteNumber].some(
      (item) => !item || (typeof item === "string" && item.trim() === "")
    )
  ) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    // Check for duplicate unique fields (username, voteNumber)
    const existingStudent = await Student.findOne({
      $or: [{ username }, { voteNumber }],
    });

    if (existingStudent) {
      if (existingStudent.username === username) {
        return next(new ApiError(400, "Username is already taken"));
      }
      if (existingStudent.voteNumber === voteNumber) {
        return next(new ApiError(400, "This vote number is already assigned"));
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create student
    const student = await Student.create({
      username,
      fatherName,
      password: hashedPassword,
      class: studentClass,
      section,
      voteNumber,
    });

    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(201).json({
      success: true,
      message: "Student Registered Successfully",
      student: studentResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Login student with username and password
const login = async (req, res, next) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password || username.trim() === "" || password.trim() === "") {
    return next(new ApiError(400, "Username and password are required"));
  }

  try {
    // Find student by username
    const student = await Student.findOne({ username });
    if (!student) {
      return next(new ApiError(401, "Invalid username or password"));
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid username or password"));
    }

    // Remove password from response object
    const studentResponse = student.toObject();
    delete studentResponse.password;

    res.status(200).json({
      success: true,
      message: "Student logged in successfully",
      student: studentResponse,
    });
  } catch (error) {
    next(error);
  }
};

// Get all students
const getStudents = async (req, res, next) => {
  try {
    const students = await Student.find().select("-password");

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
    const students = await Student.find({ class: studentClass }).select("-password");

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
    const student = await Student.findOne({ voteNumber }).select("-password");

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
  const { username, fatherName, password, class: studentClass, section, voteNumber } = req.body;
  const { studentId } = req.params;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ApiError(404, "Student not found with this id"));
    }

    // Check collisions for username or voteNumber with other students
    const conflictingStudent = await Student.findOne({
      _id: { $ne: studentId },
      $or: [
        ...(username ? [{ username }] : []),
        ...(voteNumber ? [{ voteNumber }] : []),
      ],
    });

    if (conflictingStudent) {
      if (conflictingStudent.username === username) {
        return next(new ApiError(400, "Username is already taken by another student"));
      }
      if (conflictingStudent.voteNumber === voteNumber) {
        return next(new ApiError(400, "Vote number is already assigned to another student"));
      }
    }

    student.username = username || student.username;
    student.fatherName = fatherName || student.fatherName;
    student.class = studentClass || student.class;
    student.section = section || student.section;
    student.voteNumber = voteNumber || student.voteNumber;

    if (password) {
      const saltRounds = 10;
      student.password = await bcrypt.hash(password, saltRounds);
    }

    await student.save();

    const updatedStudentResponse = student.toObject();
    delete updatedStudentResponse.password;

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudentResponse,
    });
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
  login,
  getStudents,
  getStudentsByClass,
  getStudentByVoteNumber,
  updateStudent,
  deleteStudent,
};