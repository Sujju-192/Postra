import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  addComment,
  createPost,
  getFeed,
  getUserPosts,
  toggleLike,
} from "../controllers/post.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/feed", verifyJWT, getFeed);
router.post("/", verifyJWT, upload.single("image"), createPost);
router.get("/user/:id", verifyJWT, getUserPosts);
router.post("/:id/like", verifyJWT, toggleLike);
router.post("/:id/comments", verifyJWT, addComment);

export default router;
