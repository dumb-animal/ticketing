import nats from "node-nats-streaming";
import TickeCreatedPublisher from "./events/ticket-created-publisher";

// client
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222"
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TickeCreatedPublisher(stan);
  await publisher.publish({
    id: "123",
    price: 20,
    title: "Hello world",
    userId: ""
  }).catch((err) => console.log(err));

}); 