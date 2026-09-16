import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import auth from "./middlewares/auth.js";
import userRouter from "./routes/user.route.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import helmet from "helmet";
import { limiter } from "./config/rateLimiter.js";

dotenv.config();
const port = process.env.PORT;

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== "production"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", auth, userRouter);
app.use("/api/message", auth, messageRouter);

app.use(errorHandler);

server.listen(port, () => {
  connectDb();
  console.log(`Server started at port : ${port}`);
});
