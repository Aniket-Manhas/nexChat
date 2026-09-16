import { message, sendmessage } from "../controllers/message.controller.js";
import express from "express";
import { upload } from "../middlewares/multer.js";

const messageRouter = express.Router();

messageRouter.get("/:receiver", message);
messageRouter.post("/:receiver", upload.single("image"), sendmessage);

export default messageRouter;
