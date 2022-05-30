import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@dumb-animal/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.post("/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .custom((id: string) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("ticket id is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  });

export { router as newOrder };