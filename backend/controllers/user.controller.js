import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from "../utils/tokens.js";

export { generateAccessToken, generateRefreshToken };

// =========================
// REGISTER USER
// =========================

export const registerUser = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      firstName,
      lastName,
      profilePic,
      gender,
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    await User.create({
      userName,
      email,
      password,
      firstName,
      lastName,
      profilePic,
      gender,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// LOGIN USER
// =========================

export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isValid = await user.isPasswordCorrect(password);

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Save refresh token
    user.refreshToken = refreshToken;

    await user.save({
      validateBeforeSave: false,
    });

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// LOGOUT USER
// =========================

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        {
          $unset: {
            refreshToken: 1,
          },
        }
      );
    }

    clearAuthCookies(res);

    return res.status(200).json({
      message: "Logged out",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// CURRENT USER
// =========================

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken?.toString() !== refreshToken) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    setAuthCookies(res, accessToken, newRefreshToken);

    return res.status(200).json({ message: "Token refreshed" });
  } catch {
    clearAuthCookies(res);
    return res.status(401).json({ message: "Session expired. Please log in again." });
  }
};

const publicUserSelect = "-password -refreshToken -email";

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(publicUserSelect);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const me = await User.findById(req.user.id).select("followings");
    const isFollowing = me.followings.some(
      (id) => String(id) === String(user._id),
    );
    const isSelf = String(user._id) === String(req.user.id);

    return res.status(200).json({
      user: {
        ...user.toObject(),
        isFollowing,
        isSelf,
        followerCount: user.followers?.length ?? 0,
        followingCount: user.followings?.length ?? 0,
        postCount: user.posts?.length ?? 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) {
      return res.status(200).json({ users: [] });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const users = await User.find({
      _id: { $ne: req.user.id },
      $or: [
        { userName: regex },
        { firstName: regex },
        { lastName: regex },
        { email: regex },
      ],
    })
      .select("userName firstName lastName profilePic followers followings")
      .limit(20);

    const me = await User.findById(req.user.id).select("followings");
    const followingSet = new Set(me.followings.map((id) => String(id)));

    return res.status(200).json({
      users: users.map((u) => ({
        _id: u._id,
        userName: u.userName,
        firstName: u.firstName,
        lastName: u.lastName,
        profilePic: u.profilePic,
        followerCount: u.followers?.length ?? 0,
        isFollowing: followingSet.has(String(u._id)),
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    if (String(targetId) === String(currentUserId)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const target = await User.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { followings: targetId },
    });
    await User.findByIdAndUpdate(targetId, {
      $addToSet: { followers: currentUserId },
    });

    const updated = await User.findById(targetId).select("followers");

    return res.status(200).json({
      message: "Followed",
      followerCount: updated.followers.length,
      isFollowing: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const currentUserId = req.user.id;

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { followings: targetId },
    });
    await User.findByIdAndUpdate(targetId, {
      $pull: { followers: currentUserId },
    });

    const updated = await User.findById(targetId).select("followers");

    return res.status(200).json({
      message: "Unfollowed",
      followerCount: updated?.followers?.length ?? 0,
      isFollowing: false,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("followers")
      .populate("followers", "userName firstName lastName profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ users: user.followers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("followings")
      .populate("followings", "userName firstName lastName profilePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ users: user.followings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};