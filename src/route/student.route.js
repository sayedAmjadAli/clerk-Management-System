import { Router } from "express";
import {
  register,
  login,
  getStudents,
  getStudentsByClass,
  getStudentByVoteNumber,
  updateStudent,
  deleteStudent,
} from "../controller/student.controller.js";

const studentRoute = Router();

// Register a new student
studentRoute.route("/register").post(register);

// Login student
studentRoute.route("/login").post(login);

// Get all students
studentRoute.route("/getStudents").get(getStudents);

// Get students by class
studentRoute.route("/getStudentsByClass/:class").get(getStudentsByClass);

// Get student by vote number
studentRoute.route("/getStudentByVoteNumber/:voteNumber").get(getStudentByVoteNumber);

// Update or delete a student by ID
studentRoute
  .route("/:studentId")
  .patch(updateStudent)
  .delete(deleteStudent);

export { studentRoute };