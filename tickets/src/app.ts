import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

// import { currentUserRouter } from "./routes/current-user";
// import { signinRouter } from "./routes/signin";
// import { signoutRouter } from "./routes/signout";
// import { signupRouter } from "./routes/signup";

// import { errorHandler } from "@dumb-animal/common";
// import { NotFoundError } from "@dumb-animal/common";

const app = express();

// MIDDLEWARE
app.set('trust proxy', true);

app.use(express.json());
app.use(cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" }))

// ROUTERS
// app.use(currentUserRouter);
// app.use(signinRouter);
// app.use(signoutRouter);
// app.use(signupRouter);

// ERROR HANDLER
// app.all("*", (req, res, next) => next(new NotFoundError()));
// app.use(errorHandler);

export default app;