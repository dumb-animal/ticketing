import express from "express";

const PORT = 3000;
const app = express();

app.use(express.json());

app.get("/api/users/current", (req, res) => {
  res.send("Hi there!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})