import request from "supertest";
import app from "../../app";

const createTicket = async (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", await global.signin())
    .send({ title, price })
};

it("can fetch a list of tickets", async () => {

  await createTicket("New ticket 1", 500);
  await createTicket("New ticket 2", 500);
  await createTicket("New ticket 3", 500);

  const response = await request(app)
    .get("/api/tickets")
    .set("Cookie", await global.signin())
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
});