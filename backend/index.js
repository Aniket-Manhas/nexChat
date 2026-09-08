import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.listen(port, () => {
  connectDb();
  console.log(`Server started at port : ${port}`);
});
