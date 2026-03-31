import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

const app =express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({limit: "64kb"}));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

//routes import
import userRouter from "./routes/user.routes.js"


//routes declaration
app.use("/api/v1/users", userRouter)

export {app}