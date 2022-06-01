import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from "@dumb-animal/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import Ticket from "../models/ticket";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .custom((id: string) => mongoose.Types.ObjectId.isValid(id))
      .withMessage("ticket id is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // meke sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError("Ticket is already reserved");

    // calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      expiresAt: expiration,
      status: OrderStatus.Created,
      ticket
    });
    await order.save();

    // publish an event saying that an order was created


    res.status(201).send(order);
  });

export { router as newOrder };