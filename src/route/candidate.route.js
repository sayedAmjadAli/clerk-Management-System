import { Router } from "express";
import {
  createPosition,
  getPositions,
  getCandidatesByPosition,
  addCandidateToPosition,
  deleteCandidateFromPosition,
} from "../controller/candidates.controller.js";
import { upload } from "../middleware/multer.js";

const candidateRoute = Router();

// ✅ Create position with multiple candidates (and their respective profile pictures)
candidateRoute.route("/create").post(upload.array("profiles", 10), createPosition);

// ✅ Get all positions (with candidates)
candidateRoute.route("/positions").get(getPositions);

// ✅ Get candidates by position
candidateRoute.route("/positions/:position").get(getCandidatesByPosition);

// ✅ Add single candidate to an existing position
candidateRoute.route("/positions/:position/add").post(upload.single("profile"), addCandidateToPosition);

// ✅ Delete a candidate from a position
candidateRoute
  .route("/positions/:position/:candidateId")
  .delete(deleteCandidateFromPosition);

export { candidateRoute };