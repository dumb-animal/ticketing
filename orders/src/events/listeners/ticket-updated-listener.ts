import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@dumb-animal/common";
import Ticket from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = process.env.QUEUE_GROUP_NAME!;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {

    const ticket = await Ticket.findPrevVersion(data);
    if (!ticket) throw new Error("Ticket not found");

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  };
};