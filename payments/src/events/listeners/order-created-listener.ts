import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@dumb-animal/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      version: data.version,
      userId: data.userId
    });
    await order.save();

    msg.ack();
  }
}