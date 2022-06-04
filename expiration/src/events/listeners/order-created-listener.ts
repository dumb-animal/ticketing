import { Listener, OrderCreatedEvent, Subjects } from "@dumb-animal/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = process.env.REDIS_HOST!;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("Expire after (ms): ", delay);

    await expirationQueue.add({ orderId: data.id }, { delay });

    msg.ack();
  };
};