import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const PORT = 3000;
const app = express();

// MIDDLEWARE
app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: true
}))

// ROUTERS
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// ERROR HANDLER
app.all("*", (req, res, next) => next(new NotFoundError()));
app.use(errorHandler);

// SERVER
const start = async () => {
  // CHECK ENVIRONMENTS
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is not defined");

  // DB CONNECTION
  await mongoose.connect("mongodb://auth-mongo-service:27017/auth")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to database: ", err));

  // LISTENER
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

start();
