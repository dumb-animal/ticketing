import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it("return a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", await global.signin())
    .send({ title: "New Title", price: 200 })
    .expect(404)
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: "New Title", price: 200 })
    .expect(401)
});

it("returns a 401 if the user does not own the ticket", async () => {
  const ticketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({ title: "Title", price: 500 })

  await request(app)
    .put(`/api/tickets/${ticketResponse.body.id}`)
    .set("Cookie", await global.signin())
    .send({ title: "New Title", price: 300 })
    .expect(401)
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Title", price: 500 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "", price: 200 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "New Title", price: -10 })
    .expect(400)
});

it("updates the ticket if the provided valid inputs", async () => {
  const cookie = await global.signin();

  const newTitle = "New title";
  const newPrice = 500;

  // Create ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "Title", price: 500 })

  // Update ticket
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: newTitle, price: newPrice })
    .expect(200)

  // Get ticket
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send()
    .expect(200)

  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});