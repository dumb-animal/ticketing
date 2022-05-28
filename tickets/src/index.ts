import mongoose from "mongoose";
import app from "./app";

const PORT = 3000;
const MONGO_URI = "mongodb://auth-mongo-service:27017/auth";

const start = async () => {
  // CHECK ENVIRONMENTS
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is not defined");

  // DB CONNECTION
  await mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to database: ", err));

  // LISTENER
  app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

start();
