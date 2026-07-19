import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "../utils/tokens.js";

const verifyJWT = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Valid access token — continue
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = { id: decoded.id };
      return next();
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        // Malformed access token — try refresh if available
        if (!refreshToken) {
          clearAuthCookies(res);
          return res.status(401).json({ message: "Invalid access token" });
        }
      }
      // TokenExpiredError or will try refresh below
    }
  }

  // Refresh access token using refresh cookie
  if (!refreshToken) {
    clearAuthCookies(res);
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "User not found" });
    }

    const stored = user.refreshToken?.toString();
    if (!stored || stored !== refreshToken) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    setAuthCookies(res, newAccessToken, newRefreshToken);
    req.user = { id: user._id.toString() };
    return next();
  } catch (err) {
    clearAuthCookies(res);
    const message =
      err.name === "TokenExpiredError"
        ? "Session expired. Please log in again."
        : "Authentication failed";
    return res.status(401).json({ message });
  }
};

export default verifyJWT;
