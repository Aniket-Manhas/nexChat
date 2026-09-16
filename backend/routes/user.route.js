import express from "express";
import {
  addProfile,
  getConversations,
  getUsers,
  userById,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/", userById);
userRouter.get("/users", getUsers);
userRouter.get("/conversations", getConversations);
userRouter.patch("/profile", auth, upload.single("image"), addProfile);

export default userRouter;

