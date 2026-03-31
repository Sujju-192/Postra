import dotenv from "dotenv"
dotenv.config();
import express, { json } from "express";
import cors from "cors";

const app = express();
app.use(cors())
app.use(json())
// import { connectDB } from "./db/connectDB.js";
// import { app } from "./app.js";

app.listen(process.env.PORT, () => {
    console.log(`⚒️  Server running on port ${process.env.PORT || 3000}`)
}) 

app.get("/", (req, res) => {
  res.send("Hi this is / route")
});
app.get("/api/jokes", (req, res) => {
  const jokes = [
    {
      title: "joke1",
      content: "buzhhzijqozjozoooz"
    },
    {
      title: "joke2",
      content: "buzhhzijqozjozoooz"
    },
    {
      title: "joke3",
      content: "buzhhzijqozjozoooz"
    },
    {
      title: "joke4",
      content: "buzhhzijqozjozoooz"
    }
  ]
  res.json(jokes);
})