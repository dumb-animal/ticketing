import express from "express";
import { currentUser, requireAuth } from "@dumb-animal/common";

const router = express.Router();

router.get("/api/users/currentuser",
  currentUser,
  (req, res) => {
    res.status(200).json({ currentUser: req.currentUser || null });
  });

export { router as currentUserRouter };