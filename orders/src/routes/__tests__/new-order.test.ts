import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Order, OrderStatus } from "../../models/order";
import Ticket from "../../models/ticket";


it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await global.signin())
    .send({ ticketId })
    .expect(404)
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "Title",
    price: 20
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "626e8abb42e7a1c571b3cc11",
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)

});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    title: "Title",
    price: 20
  });
  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", await global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)
});

it.todo("emits an order created event");