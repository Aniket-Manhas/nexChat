import mongoose from "mongoose";

const conversationScheme = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationScheme);
export default Conversation;
