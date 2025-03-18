import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Sample user data (for demo purposes)
const users = [{ username: "admin", password: "password123" }];

// Authenticate user and generate JWT token
export const loginUser = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (user) {
    return jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
  }
  return null;
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};
