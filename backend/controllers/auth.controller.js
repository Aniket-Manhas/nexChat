import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    const checkUserByUserName = await User.findOne({ userName });
    if (checkUserByUserName) {
      return res.status(400).json({ message: "Username already exist" });
    }
    const checkUserByUserEmail = await User.findOne({ email });
    if (checkUserByUserEmail) {
      return res.status(400).json({ message: "Email already exist" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });
    const token = genToken(user._id);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `error from signup controller ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      return res.status(400).json({
        message: "Username/email and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ email: login }, { userName: login }],
    });

    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist",
      });
    }

    const checkUserPassword = await bcrypt.compare(password, user.password);

    if (!checkUserPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = genToken(user._id);
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        userName: user.userName,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error from login controller: ${error.message}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "lax",
      path: "/",
    });
    return res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Error from login controller: ${error.message}`,
    });
  }
};
