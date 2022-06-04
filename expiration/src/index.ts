import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
  // CHECK ENVIRONMENTS
  if (!process.env.NATS_URI) throw new Error("NATS_URI is not defined");
  if (!process.env.REDIS_HOST) throw new Error("REDIS_HOST is not defined");
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

  new OrderCreatedListener(natsWrapper.client).listen();
}

start();
