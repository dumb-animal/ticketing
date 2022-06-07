import mongoose from "mongoose";
import app from "./app";

const start = async () => {
  console.log("starting up...");
  // CHECK ENVIRONMENTS
  if (!process.env.PORT) throw new Error("PORT is not defined");
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is not defined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not defined");

  // DB CONNECTION
  await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to database: ", err));

  // LISTENER
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
  });
}

start();
