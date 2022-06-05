import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@dumb-animal/common";

import { createCharge } from "./routes/new-charge";

const app = express();

// MIDDLEWARE
app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }))
app.use(currentUser);

// ROUTERS
app.use(createCharge);

// ERROR HANDLER
app.all("*", (req, res, next) => next(new NotFoundError()));
app.use(errorHandler);

export default app;