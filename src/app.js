import { config } from "dotenv";
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
export const app=express()
config({path:"./.env"})

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173","https://ic-flow-web-01.vercel.app"], 
    credentials: true 
  }))

import { userRoute } from "./route/user.route.js";
app.use("/api/user",userRoute)

import { departmentRoute } from "./route/deparment.route.js";
app.use("/api/department",departmentRoute)

import { studentRoute } from "./route/student.route.js";
app.use("/api/student",studentRoute)

import { feeRoute } from "./route/fee.route.js";
app.use("/api/fee",feeRoute)