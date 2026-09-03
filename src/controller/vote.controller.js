import { Vote } from "../models/vote.model.js";
import { Student } from "../models/student.model.js";
import { Candidate } from "../models/candidate.model.js";
import { ApiError } from "../utlis/ApiError.js";

// ✅ Cast a vote
const castVote = async (req, res, next) => {
  const { studentId, candidateId, position } = req.body;

  if (!studentId || !candidateId || !position) {
    return next(new ApiError(400, "Student, Candidate, and Position are required"));
  }

  try {
    // 🔹 Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return next(new ApiError(404, "Student not found"));
    }

    // 🔹 Check if position exists
    const pos = await Candidate.findOne({ position });
    if (!pos) {
      return next(new ApiError(404, "Position not found"));
    }

    // 🔹 Check if candidate exists under this position
    const candidate = pos.candidates.id(candidateId);
    if (!candidate) {
      return next(new ApiError(404, "Candidate not found in this position"));
    }

    // 🔹 Check if student already voted for this position
    const existingVote = await Vote.findOne({ student: studentId, position });
    if (existingVote) {
      return next(new ApiError(400, "Student has already voted for this position"));
    }

    // 🔹 Cast vote
    const vote = await Vote.create({
      student: studentId,
      candidate: candidateId,
      position,
    });

    res.status(201).json({
      success: true,
      message: "Vote cast successfully",
      vote,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all votes
const getVotes = async (req, res, next) => {
  try {
    const votes = await Vote.find()
      .populate("student", "username class section voteNumber")
      .populate("candidate", "name")
      .lean();

    if (!votes || votes.length === 0) {
      return next(new ApiError(404, "No votes found"));
    }

    res.status(200).json({
      success: true,
      message: "Votes fetched successfully",
      votes,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get votes by candidate
const getVotesByCandidate = async (req, res, next) => {
  const { candidateId, position } = req.params;

  try {
    const votes = await Vote.find({ candidate: candidateId, position })
      .populate("student", "username class section voteNumber")
      .lean();

    if (!votes || votes.length === 0) {
      return next(new ApiError(404, "No votes found for this candidate in this position"));
    }

    res.status(200).json({
      success: true,
      message: "Votes fetched successfully",
      votes,
    });
  } catch (error) {
    next(error);
  }
};

export { castVote, getVotes, getVotesByCandidate };
