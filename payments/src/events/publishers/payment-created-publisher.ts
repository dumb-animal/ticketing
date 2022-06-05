import { Subjects, Publisher, PaymentCreatedEvent } from "@dumb-animal/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}