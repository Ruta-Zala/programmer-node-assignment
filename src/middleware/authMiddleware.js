import jwt from "jsonwebtoken";

// Middleware to verify JWT authentication
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token", error });
  }
};

export default authMiddleware;
