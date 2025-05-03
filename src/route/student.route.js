import { Router } from "express";
import { deleteStudent, getStudentByBatch, getStudentByRollno, getStudentProfile, getStudentProfileByRollno, getStudents, register, updateStudent } from "../controller/student.controller.js";
import {auth} from "../middleware/auth.js"


const studentRoute=Router()

studentRoute.route("/register").post(auth,register)
studentRoute.route("/getStudents").get(auth,getStudents)
studentRoute.route("/getStudentsByBatch/:batch").get(auth,getStudentByBatch)
studentRoute.route("/getStudentByRollno/:rollno").get(auth,getStudentByRollno)
studentRoute.route("/rollno/:rollno").get(getStudentProfileByRollno)
studentRoute.route("/:studentId").patch(updateStudent).delete(deleteStudent).get(getStudentProfile)
export {studentRoute}