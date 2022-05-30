import { Publisher, Subjects, TicketUpdatedEvent } from "@dumb-animal/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
};