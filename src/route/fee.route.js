import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addFees, getFeesByBatch, getFeesByStudent } from "../controller/fee.controller.js";
const feeRoute=Router()

feeRoute.route("/addFee").post(addFees)

feeRoute.route("/batch/:batch").post(getFeesByBatch)
feeRoute.route("/student/:studentId").get(getFeesByStudent)
export {feeRoute}