import { Subjects, Publisher, ExpirationCompleteEvent } from "@dumb-animal/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
};