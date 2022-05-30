import { Publisher, Subjects, TicketCreatedEvent } from "@dumb-animal/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
};