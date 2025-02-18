import { Department } from "../models/department.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utlis/ApiError.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const registerChairman = async (req, res, next) => {
  const { name, email, password, department } = req.body;

  console.log(req.body);

  if ([name, email, password, department].some((item) => item?.trim() == "")) {
    return next(new ApiError(400, "All Feilds are Require"));
  }

  const exitsDepartmentWithThisId = await Department.findOne({
    _id: department,
  });

  if (!exitsDepartmentWithThisId) {
    return next(new ApiError(400, "Department Not Found"));
  }

  const exits = await User.findOne({ email });

  if (exits) {
    return next(new ApiError(400, "This User Already Exits"));
  }

  const user = await User.create({
    name,
    email,
    password,
    department,
    role: "chairman",
  });

  if (!user) {
    return next(new ApiError(401, "Error Occur While registering chairman"));
  }

  res.status(200).json({
    message: "Successfully register chairman",
    success: true,
    user: user,
  });
};

const createAdmin = async (req, res, next) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((item) => item?.trim() == "")) {
    return next(new ApiError(400, "All Feilds are Require"));
  }

  try {
    const exitsUser = await User.findOne({ email });
    if (exitsUser) {
      return next(new ApiError(400, "This User Already Exits"));
    }

    const user = await User.create({ name, email, password, role: "admin" });

    if (!user) {
      return next(new ApiError(401, "Error Occur While registering admin"));
    }
    res
      .status(200)
      .json({ success: true, message: "Admin successfully registered" });
  } catch (error) {
    next(error);
  }
};

const registerClerk = async (req, res, next) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((item) => item?.trim() == "")) {
    return next(new ApiError(400, "All Feilds are Require"));
  }

  const exits = await User.findOne({ email });

  if (exits) {
    return next(new ApiError(400, "This clerk Already Exits"));
  }

  const user = await User.create({
    name,
    email,
    password,
    department: req?.user.department,
  });

  if (!user) {
    return next(new ApiError(401, "Error Occur While registering clerk"));
  }

  res.status(200).json({
    message: "Successfully clerk registered",
    success: true,
    user: user,
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if ([email, password].some((item) => item.trim() == "")) {
      return next(new ApiError(401, "All fields are require"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(400, "Incorrect Email"));
    }

    const checkPassword = password == user?.password;

    if (!checkPassword) {
      return next(new ApiError(401, "Password is incorrect......"));
    }

    const user_ = await User.findOne({ email }).select("-password");
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);

    res
      .status(200)
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .json({
        user_,
        token,
        message: "Sucessfully login",
        success: true,
      });
  } catch (error) {
    next(error);
  }
};

const getChairmmain = async (req, res, next) => {
  try {
    const chairman = await User.aggregate([
      { $match: { role: "chairman" } },
      {
        $lookup: {
          from: "departments",
          localField: "department",
          foreignField: "_id",
          as: "department",
        },
      },

      {
        $addFields:{
          department: { $arrayElemAt: ["$department", 0] }
        }
      }
    ]);
    if (!chairman) {
      return next(new ApiError(400, "No Chairman found"));
    }
    res.status(200).json({ success: true, message: "Get Chairman", chairman });
  } catch (error) {
    next(new ApiError(500, "Server Error ", error.message));
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    path: "/",
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Sucessfully Logout", success: true });
};

export {
  registerChairman,
  registerClerk,
  login,
  getChairmmain,
  createAdmin,
  logout,
};
