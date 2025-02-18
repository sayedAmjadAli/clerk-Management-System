import { Router } from "express";
import { getStudentByBatch, getStudentByRollno, getStudents, register } from "../controller/student.controller.js";
import {auth} from "../middleware/auth.js"


const studentRoute=Router()

studentRoute.route("/register").post(auth,register)
studentRoute.route("/getStudents").get(auth,getStudents)
studentRoute.route("/getStudentsByBatch/:batch").get(auth,getStudentByBatch)
studentRoute.route("/getStudentByRollno/:rollno").get(auth,getStudentByRollno)
export {studentRoute}