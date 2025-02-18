import { Router } from "express";
import { createAdmin, getChairmmain, login, logout, registerChairman, registerClerk, } from "../controller/user.controller.js";
import { auth } from "../middleware/auth.js";
const userRoute=Router()

userRoute.route("/login").post(login)
userRoute.route("/registerChairman").post(registerChairman)
userRoute.route("/createAdmin").post(createAdmin)
userRoute.route("/registerClerk").post(auth,registerClerk)

userRoute.route("/logout").post(auth,logout)
userRoute.route("/getChairmans").get(auth,getChairmmain)


export {userRoute}