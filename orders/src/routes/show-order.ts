import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@dumb-animal/common";
import { Order } from "../models/order";


const router = express.Router();

router.get("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) throw new NotFoundError();

  const isOwner = order.userId.toString() === req.currentUser!.id.toString();
  if (!isOwner) throw new NotAuthorizedError();

  res.status(200).json(order);
});

export { router as showOrder };