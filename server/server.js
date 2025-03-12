const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(express.json());
// ✅ Allow multiple frontend origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ Allows cookies to be sent
  })
);
app.use(cookieParser());

const users = [{ id: 1, username: "test", password: "password" }];
const accessExpiresIn = "1m";
const refreshExpiresIn = "1m";

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
let refreshTokens = [];

app.get("/", (req, res) => {
  res.send("Welcome to my Express server!");
});

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
    expiresIn: accessExpiresIn,
  });
  const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, {
    expiresIn: refreshExpiresIn,
  });
  refreshTokens.push(refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ Secure in production
    sameSite: "Strict",
  });

  res.json({ accessToken });
});

// Refresh Token API
app.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken; // ✅ Read refresh token from cookies
  if (!token)
    return res.status(403).json({ message: "No refresh token found" });

  if (!refreshTokens.includes(token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Token verification failed" });

    const newAccessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: accessExpiresIn,
    });
    res.json({ accessToken: newAccessToken });
  });
});

// Protected API Route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You have accessed a protected route!", user: req.user });
});

// Logout API - Clears refresh token and removes it from storage
app.post("/logout", (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(400).json({ message: "No refresh token found" });
  }

  // Remove the token from stored refresh tokens
  refreshTokens = refreshTokens.filter((t) => t !== token);

  // Clear the refresh token from cookies
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false, // Set to true in production (for HTTPS)
    sameSite: "Strict",
  });

  res.json({ message: "Logged out successfully" });
});

/**
 * Middleware function to authenticate a JSON Web Token (JWT).
 *
 * This function checks if the request provides an authorization token in the headers.
 * If a token is present, it verifies the token using the SECRET_KEY. If the token
 * is valid, it attaches the decoded user information to the request object and calls
 * the next middleware in the stack. If the token is missing or invalid, it responds
 * with an appropriate error message and status code.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the Express stack.
 */

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
}

app.listen(5001, () => console.log("Server running on port 5000"));
