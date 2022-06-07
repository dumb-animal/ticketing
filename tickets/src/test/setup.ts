import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  function signin(): Promise<string[]>
};

jest.mock('./../nats-wrapper');

beforeAll(async () => {
  process.env.JWT_KEY = "hello";

  // Создаем MongoDB сервер и получаем его URI
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  (global as any).__MONGOD = mongod;

  // Подключаемся к серверу
  await mongoose.connect(uri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  const mongod = (global as any).__MONGOD;

  await mongoose.disconnect();
  await mongod.stop();
});

global.signin = async () => {
  // Build a JWT payload. {id, email}
  const payload = { id: new mongoose.Types.ObjectId(), email: "test@test.com" };

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