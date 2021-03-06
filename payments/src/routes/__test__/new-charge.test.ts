import { OrderStatus } from "@dumb-animal/common";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

jest.mock("../../stripe");

it("Returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.signin())
    .send({
      token: "gsfgdgs",
      orderId: new mongoose.Types.ObjectId().toHexString()
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.signin())
    .send({
      token: "gsfgdgs",
      orderId: order.id
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    price: 20,
    userId,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.signin(userId))
    .send({
      token: "gsfgdgs",
      orderId: order.id
    })
    .expect(400);
});

it.skip("returns a 201 with valid inputs", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20,
    userId,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", await global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual("usd");
}); 