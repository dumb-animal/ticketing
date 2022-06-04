import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@dumb-animal/common";
import Ticket from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = Ticket.build({ title, price, id, version });
    await ticket.save();

    msg.ack();
  };
};