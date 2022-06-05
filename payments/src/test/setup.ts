// import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  function signin(id?: string): Promise<string[]>
};

jest.mock('./../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = "hello";
  // TODO необходимо заменить локальную БД на mongodb-memory-server
  await mongoose.connect("mongodb://localhost:27017/test")
});

beforeEach(async () => {
  jest.clearAllMocks();
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

global.signin = async (id?: string) => {
  // Build a JWT payload. {id, email}
  const payload = {
    id: id ? id : new mongoose.Types.ObjectId(),
    email: "test@test.com"
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // Returning a string thats the cookie with the encoded data
  return [`session=${base64}`];
}