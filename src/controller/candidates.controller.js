import { Candidate } from "../models/candidate.model.js";
import { ApiError } from "../utlis/ApiError.js"; // Note: fix typo if directory is 'utils'
import { cloudinaryUpload } from "../utlis/cloudinary.js"; // Import Cloudinary utility

// ✅ Create a new position with candidates (multipart/form-data)
const createPosition = async (req, res, next) => {
  try {
    const { position } = req.body;
    let candidatesData = req.body.candidates;

    // Handle stringified JSON array sent via form-data
    if (typeof candidatesData === "string") {
      try {
        candidatesData = JSON.parse(candidatesData);
      } catch (err) {
        return next(new ApiError(400, "Invalid JSON format for candidates"));
      }
    }

    if (!position || !Array.isArray(candidatesData) || candidatesData.length === 0) {
      return next(new ApiError(400, "Position and at least one candidate are required"));
    }

    const existing = await Candidate.findOne({ position });
    if (existing) {
      return next(new ApiError(400, "This position already exists"));
    }

    const files = req.files || [];

    // Map each candidate with its corresponding uploaded image on Cloudinary
    const formattedCandidates = await Promise.all(
      candidatesData.map(async (cand, index) => {
        const file = files[index];
        if (!file) {
          throw new ApiError(400, `Profile picture is required for candidate: ${cand.name}`);
        }

        // Upload local temporary file to Cloudinary
        const cloudinaryResponse = await cloudinaryUpload(file.path);

        if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
          throw new ApiError(500, `Failed to upload profile picture for: ${cand.name}`);
        }

        return {
          name: cand.name,
          profile: cloudinaryResponse.secure_url, // Store Cloudinary URL in DB
        };
      })
    );

    const newPosition = await Candidate.create({
      position,
      candidates: formattedCandidates,
    });

    res.status(201).json({
      success: true,
      message: "Position created successfully",
      newPosition,
    });
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

    res.status(200).json({
      success: true,
      message: "Positions fetched successfully",
      positions,
    });
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

    res.status(200).json({
      success: true,
      message: "Candidates fetched successfully",
      candidates,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Add single candidate to an existing position
const addCandidateToPosition = async (req, res, next) => {
  const { position } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return next(new ApiError(400, "Candidate name is required"));
  }

  if (!req.file) {
    return next(new ApiError(400, "Candidate profile picture is required"));
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

    // Upload single image to Cloudinary
    const cloudinaryResponse = await cloudinaryUpload(req.file.path);

    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      return next(new ApiError(500, "Failed to upload profile picture to Cloudinary"));
    }

    pos.candidates.push({
      name,
      profile: cloudinaryResponse.secure_url, // Save the secure Cloudinary URL
    });

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

    res.status(200).json({
      success: true,
      message: "Candidate removed successfully",
      position: pos,
    });
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