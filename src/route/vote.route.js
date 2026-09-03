import { Router } from "express";
import { castVote, getVotes, getVotesByCandidate } from "../controller/vote.controller.js";

const voteRoute = Router();

// Cast a vote
voteRoute.route("/cast").post(castVote);

// Get all votes
voteRoute.route("/getVotes").get(getVotes);

// Get votes by candidate
voteRoute.route("/byCandidate/:candidateId").get(getVotesByCandidate);

export { voteRoute };
