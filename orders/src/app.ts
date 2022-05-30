import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@dumb-animal/common";

import { newOrder } from "./routes/new-order";
import { showOrder } from "./routes/show-order";
import { showOrders } from "./routes/show-orders";
import { deleteOrder } from "./routes/delete-order";

const app = express();

// MIDDLEWARE
app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }))
app.use(currentUser);

// ROUTERS
app.use(newOrder);
app.use(showOrder);
app.use(showOrders);
app.use(deleteOrder);

// ERROR HANDLER
app.all("*", (req, res, next) => next(new NotFoundError()));
app.use(errorHandler);

export default app;