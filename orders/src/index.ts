import mongoose from "mongoose";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompletedListener } from "./events/listeners/expiration-completed-listener";

const start = async () => {
  // CHECK ENVIRONMENTS
  if (!process.env.PORT) throw new Error("PORT is not defined");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is not defined");
  if (!process.env.NATS_URI) throw new Error("NATS_URI is not defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");
  if (!process.env.NATS_CLIENT_ID) throw new Error("NATS_CLIENT_ID is not defined");
  if (!process.env.NATS_CLUSTER_ID) throw new Error("NATS_CLUSTER_ID is not defined");
  if (!process.env.QUEUE_GROUP_NAME) throw new Error("QUEUE_GROUP_NAME is not defined");


  // NATS CONNECTION
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URI)
    .then(() => console.log("connected to NATS"))
    .catch((err) => console.error("Error connecting to NATS: ", err));

  natsWrapper.client.on('close', () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  process.on("SIGINT", () => natsWrapper.client.close());
  process.on("SIGTERM", () => natsWrapper.client.close());

  // DB CONNECTION
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to database: ", err));

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedListener(natsWrapper.client).listen();
  new ExpirationCompletedListener(natsWrapper.client).listen();

  // LISTENER
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
  });
}

start();
