import express, { urlencoded } from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

const app = express()

const defaultAllowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

const envOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowAllOrigins = envOrigins.includes("*");
for (const o of envOrigins) {
  if (o !== "*") defaultAllowedOrigins.add(o);
}

console.log("CORS_ORIGIN =", process.env.CORS_ORIGIN);
app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools (no Origin header)
      if (!origin) return callback(null, true);
      if (allowAllOrigins) return callback(null, true);
      if (defaultAllowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({limit: "32kb"}));
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.send("Hello from backend");
});

//routes import
import userRouter from "./routes/user.routes.js"
import postRouter from "./routes/post.routes.js"


//routes declaration
app.use("/api/users", userRouter)
app.use("/api/posts", postRouter)


export {app}