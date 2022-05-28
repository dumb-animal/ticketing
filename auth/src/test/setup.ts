// import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

declare global {
  function signin(): Promise<string[]>
};

beforeAll(async () => {
  process.env.JWT_KEY = "hello";

  // var mongod = await MongoMemoryServer.create();
  // globalThis.__MONGOD__ = mongod;
  // const mongoUri = mongod.getUri();
  // await mongoose.connect(mongoUri)

  // TODO необходимо заменить локальную БД на mongodb-memory-server
  await mongoose.connect("mongodb://localhost:27017/test")
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();
  // const collections = await mongoose.connection.db.collections();
  // collections.forEach(async (c) => await c.deleteMany({}));
});

afterAll(async () => {
  // await globalThis.__MONGOD__.stop();
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("Set-Cookie");
  return cookie;
}