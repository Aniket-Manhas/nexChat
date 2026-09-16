import jwt from "jsonwebtoken";
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const id = jwt.verify(token, process.env.JWT_SECRET);
    req.user = id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
export default auth;
