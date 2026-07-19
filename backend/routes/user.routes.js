import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  followUser,
  getCurrentUser,
  refreshAccessToken,
  getFollowers,
  getFollowings,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  searchUsers,
  unfollowUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshAccessToken);
router.get("/profile", verifyJWT, (req, res) => {
  res.json({ user: req.user });
});
router.get("/me", verifyJWT, getCurrentUser);
router.get("/search", verifyJWT, searchUsers);
router.get("/:id/followers", verifyJWT, getFollowers);
router.get("/:id/followings", verifyJWT, getFollowings);
router.get("/:id", verifyJWT, getUserById);
router.post("/:id/follow", verifyJWT, followUser);
router.delete("/:id/follow", verifyJWT, unfollowUser);

export default router;
