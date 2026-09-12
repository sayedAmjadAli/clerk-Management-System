import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

export const app = express();
config({ path: "./.env" });

// Construct __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://148.230.97.14",
      "http://148.230.97.14:5173",
    ],
    credentials: true,
  })
);

// ===============================
// STATIC PROFILE IMAGES
// ===============================

// If app.js is inside backend/src/
// __dirname = backend/src
// ../public = backend/public
const publicPath = path.join(__dirname, "../public");

console.log("Public folder:", publicPath);
console.log("Profile folder:", path.join(publicPath, "profile"));

// Example:
// backend/public/profile/student.jpg
// URL:
// http://148.230.97.14/profile/student.jpg

app.use(
  "/profile",
  express.static(path.join(publicPath, "profile"))
);

// ===============================
// API ROUTES
// ===============================

import { studentRoute } from "./route/student.route.js";
app.use("/api/student", studentRoute);

import { candidateRoute } from "./route/candidate.route.js";
app.use("/api/candidate", candidateRoute);

import { voteRoute } from "./route/vote.route.js";
app.use("/api/vote", voteRoute);