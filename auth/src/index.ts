import express from "express";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

import { errorHandler } from "./middlewares/error-handler";

const PORT = 3000;
const app = express();

// MIDDLEWARE
app.use(express.json());

// ROUTERS
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// ERROR HANDLER
app.use(errorHandler);

// EXPORTS
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});