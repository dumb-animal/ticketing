import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";
import request from "supertest";
import app from "../app";

declare global {
  function signin(): Promise<string[]>;
};

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
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  const mongod = (global as any).__MONGOD;

  await mongoose.disconnect();
  await mongod.stop();
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