import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";

it('returns 400 if the wrong ticket id was passed', async () => {
  await request(app)
    .get("/api/tickets/wrong-id")
    .send()
    .expect(400)
});

it('returns 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404)
});

it("returns the ticket if the ticket is found", async () => {

  const title = "new title";
  const price = 50;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({ title, price })
    .expect(201)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .set("Cookie", await global.signin())
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});