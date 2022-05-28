import express, { Request, Response } from "express";
import { NotFoundError, validateRequest, requireAuth, NotAuthorizedError } from "@dumb-animal/common";
import { body } from "express-validator";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.put("/api/tickets/:id", requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be provided and must be greater than 0")
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new NotFoundError();

    const isOwner = ticket.userId.toString() === req.currentUser?.id;
    if (!isOwner) throw new NotAuthorizedError();

    ticket.set({ ...req.body });
    await ticket.save();

    res.status(200).json(ticket);
  });

export { router as updateTicket };