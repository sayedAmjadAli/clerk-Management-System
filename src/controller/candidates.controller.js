import { Candidate } from "../models/candidate.model.js";
import { ApiError } from "../utlis/ApiError.js";

// ✅ Create a new position with candidates
const createPosition = async (req, res, next) => {
  const { position, candidates } = req.body;

  if (!position || !Array.isArray(candidates) || candidates.length === 0) {
    return next(new ApiError(400, "Position and candidates are required"));
  }

  try {
    const existing = await Candidate.findOne({ position });
    if (existing) {
      return next(new ApiError(400, "This position already exists"));
    }

    const newPosition = await Candidate.create({ position, candidates });
    res
      .status(201)
      .json({ success: true, message: "Position created successfully", newPosition });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all positions with candidates
const getPositions = async (req, res, next) => {
  try {
    const positions = await Candidate.find();

    if (!positions || positions.length === 0) {
      return next(new ApiError(404, "No positions found"));
    }

    res
      .status(200)
      .json({ success: true, message: "Positions fetched successfully", positions });
  } catch (error) {
    next(error);
  }
};

// ✅ Get candidates by position
const getCandidatesByPosition = async (req, res, next) => {
  const { position } = req.params;

  try {
    const candidates = await Candidate.findOne({ position });

    if (!candidates) {
      return next(new ApiError(404, "Position not found"));
    }

    res
      .status(200)
      .json({ success: true, message: "Candidates fetched successfully", candidates });
  } catch (error) {
    next(error);
  }
};

// ✅ Add candidate to an existing position
const addCandidateToPosition = async (req, res, next) => {
  const { position } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return next(new ApiError(400, "Candidate name is required"));
  }

  try {
    const pos = await Candidate.findOne({ position });

    if (!pos) {
      return next(new ApiError(404, "Position not found"));
    }

    const alreadyExists = pos.candidates.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    if (alreadyExists) {
      return next(new ApiError(400, "Candidate already exists for this position"));
    }

    pos.candidates.push({ name });
    await pos.save();

    res.status(200).json({
      success: true,
      message: "Candidate added successfully",
      position: pos,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete candidate from a position
const deleteCandidateFromPosition = async (req, res, next) => {
  const { position, candidateId } = req.params;

  try {
    const pos = await Candidate.findOne({ position });

    if (!pos) {
      return next(new ApiError(404, "Position not found"));
    }

    pos.candidates = pos.candidates.filter(
      (c) => c._id.toString() !== candidateId
    );

    await pos.save();

    res
      .status(200)
      .json({ success: true, message: "Candidate removed successfully", position: pos });
  } catch (error) {
    next(error);
  }
};

export {
  createPosition,
  getPositions,
  getCandidatesByPosition,
  addCandidateToPosition,
  deleteCandidateFromPosition,
};
