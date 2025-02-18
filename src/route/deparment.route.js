import { Router } from "express";
import { getDepartments, register } from "../controller/department.controller.js";


const departmentRoute=Router()


departmentRoute.route("/register").post(register)
departmentRoute.route("/getDepartments").get(getDepartments)
export {departmentRoute}