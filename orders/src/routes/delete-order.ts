import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@dumb-animal/common";
import { Order, OrderStatus } from "../models/order";

const router = express.Router();

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) throw new NotFoundError();

  const isOwner = order.userId.toString() === req.currentUser!.id.toString();
  if (!isOwner) throw new NotAuthorizedError();

  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  // Publishing an event saying that an order was cancelled

  res.status(200).send(order);
});

export { router as deleteOrder };