import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      default: "",
      maxLength: 250,
    },
    image: {
      type: String,
      default: "",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);
messageSchema.index({ conversationId: 1, _id: -1 });
const Message = mongoose.model("Message", messageSchema);
export default Message;
