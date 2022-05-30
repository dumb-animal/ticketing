import request from "supertest";
import app from "../../app";
import { natsWrapper } from "../../nats-wrapper";

import { Ticket } from "../../models/ticket";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .send({})
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app)
    .post("/api/tickets")
    .send({})
    .expect(401)
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({})

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({ price: "500" })
    .expect(400)
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({ title: "Ticket title" })
    .expect(400)
});

it("creates a tickets with valid inputes", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const price = 66.6;
  const title = "Ticket title";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({ title, price })
    .expect(201)

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].title).toEqual(title);
});

it("publishes an event", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const price = 66.6;
  const title = "Ticket title";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({ title, price })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});