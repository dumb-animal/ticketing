import { Subjects, Publisher, OrderCreatedEvent } from "@dumb-animal/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
};