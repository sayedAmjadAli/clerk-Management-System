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
    origin:["http://localhost:5173","http://148.230.97.14:5173"], 
    credentials: true 
  }))

import { studentRoute } from "./route/student.route.js";
app.use("/api/student",studentRoute)

import { candidateRoute } from "./route/candidate.route.js";
app.use("/api/candidate",candidateRoute)


import { voteRoute } from "./route/vote.route.js";
app.use("/api/vote",voteRoute)