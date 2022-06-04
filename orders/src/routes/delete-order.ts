import express, { Request, Response } from "express";
import { NotAuthorizedError, NotFoundError, requireAuth } from "@dumb-animal/common";
import { Order, OrderStatus } from "../models/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete("/api/orders/:orderId", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate("ticket");
  if (!order) throw new NotFoundError();

  const isOwner = order.userId.toString() === req.currentUser!.id.toString();
  if (!isOwner) throw new NotAuthorizedError();

  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  // Publishing an event saying that an order was cancelled
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
      price: order.ticket.price
    }
  });

  res.status(200).send(order);
});

export { router as deleteOrder };