import dotenv from "dotenv";
dotenv.config(); // simplest and correct
import { connectDB } from "./db/connectDB.js";
import { app } from "./app.js";
 
connectDB()
.then(
  app.listen(process.env.PORT || 5000, () => {
    console.log(`⚒️  Server running on port ${process.env.PORT || 5000}`)
  })
)
.catch((err) => {
  console.log("There is some connection error in the connectDB.js")
})

