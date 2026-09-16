import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/User.model.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const userById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error in user controller" });
  }
};

export const addProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name && !req.file) {
      return res.status(400).json({
        message: "At least a name or profile image is required",
      });
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    if (req.file) {
      const image = await uploadOnCloudinary(req.file.path);
      if (image === "") {
        return res.status(500).json({
          message: "Image upload failed",
        });
      }
      updateData.image = image;
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error in user controller image upload failed" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {
      _id: { $ne: req.user.id },
    };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { userName: regex }, { email: regex }];
    }

    const users = await User.find(query).select("-password").limit(50);
    return res.status(200).json({ users });
  } catch (error) {
    console.log("Error in getUsers:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants", "-password")
      .sort({ updatedAt: -1 });

    const conversationList = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
          .sort({ _id: -1 })
          .lean();

        const otherParticipant = conv.participants.find(
          (p) => p._id.toString() !== currentUserId.toString()
        );

        return {
          _id: conv._id,
          otherParticipant: otherParticipant || null,
          participants: conv.participants,
          lastMessage: lastMessage || null,
          updatedAt: conv.updatedAt,
        };
      })
    );

    return res.status(200).json({ conversations: conversationList });
  } catch (error) {
    console.log("Error in getConversations:", error);
    return res.status(500).json({ message: "Failed to fetch conversations" });
  }
};
