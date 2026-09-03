import { Router } from "express";
import {
  createPosition,
  getPositions,
  getCandidatesByPosition,
  addCandidateToPosition,
  deleteCandidateFromPosition,
} from "../controller/candidates.controller.js";

const candidateRoute = Router();

// ✅ Create a new position with candidates
candidateRoute.route("/create").post(createPosition);

// ✅ Get all positions (with candidates)
candidateRoute.route("/positions").get(getPositions);

// ✅ Get candidates by position
candidateRoute.route("/positions/:position").get(getCandidatesByPosition);

// ✅ Add candidate to an existing position
candidateRoute.route("/positions/:position/add").post(addCandidateToPosition);

// ✅ Delete a candidate from a position
candidateRoute
  .route("/positions/:position/:candidateId")
  .delete(deleteCandidateFromPosition);

export { candidateRoute };
