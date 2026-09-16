import uploadOnCloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { io, getRoomId } from "../socket/socket.js";

export const sendmessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const { receiver } = req.params;
    const { message } = req.body;
    if (!message && !req.file) {
      return res.status(400).json({
        message: "Message or image is required",
      });
    }
    let image = "";
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
      if (!image) {
        return res.status(500).json({
          message: "Image upload failed",
        });
      }
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
      });
    }
    let newMessage = await Message.create({
      sender,
      receiver,
      message,
      image,
      conversationId: conversation._id,
    });

    const roomId = getRoomId(sender, receiver);
    if (roomId) {
      io.to(roomId).emit("notification", { newMessage });
    }
    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.log("Error in messgae controller", error);
    return res.status(500).json({
      message: "Message send failed",
    });
  }
};

export const message = async (req, res) => {
  try {
    const sender = req.user.id;
    const { receiver } = req.params;
    const { before } = req.query;
    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }
    const query = {
      conversationId: conversation._id,
    };
    if (before) {
      query._id = { $lt: before };
    }
    const messages = await Message.find(query)
      .sort({ _id: -1 })
      .limit(40)
      .lean();
    messages.reverse();

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
      hasMore: messages.length === 40,
    });
  } catch (error) {
    console.log("Error in message controller", error);
    return res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};
