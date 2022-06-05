import { Listener, ExpirationCompleteEvent, Subjects } from "@dumb-animal/common";
import { Message } from "node-nats-streaming";
import { Order, OrderStatus } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompleteEvent>{
  queueGroupName = process.env.QUEUE_GROUP_NAME!;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) throw new Error("Order not found");
    if (order.status === OrderStatus.Complete) return msg.ack();

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price
      }
    });

    msg.ack();
  };
}