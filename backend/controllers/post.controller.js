import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { uploadImageBufferToCloudinary } from "../utils/cloudinary.js";
import { formatPost, postPopulateOptions } from "../utils/postHelpers.js";

export const createPost = async (req, res) => {
  try {
    const { description, hashtags } = req.body ?? {};

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const rawTags = Array.isArray(hashtags)
      ? hashtags
      : typeof hashtags === "string"
        ? hashtags.split(",")
        : [];

    const normalizedHashtags = rawTags
      .map((t) => String(t).trim())
      .filter(Boolean)
      .map((t) => (t.startsWith("#") ? t : `#${t}`));

    let imgUrl = "";
    if (req.file?.buffer) {
      imgUrl = await uploadImageBufferToCloudinary({
        buffer: req.file.buffer,
      });
    }

    const post = await Post.create({
      description: description?.trim() || "",
      hashtags: normalizedHashtags,
      img: imgUrl,
      createdBy: userId,
    });

    await User.findByIdAndUpdate(userId, { $push: { posts: post._id } });

    const populated = await Post.findById(post._id).populate(
      postPopulateOptions,
    );

    return res.status(201).json({
      message: "Post created successfully",
      post: formatPost(populated, userId),
    });
  } catch (error) {
    console.error("createPost error:", error?.message || error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Failed to create post",
    });
  }
};

export const getFeed = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate(postPopulateOptions),
      Post.countDocuments(),
    ]);

    return res.status(200).json({
      posts: posts.map((p) => formatPost(p, req.user?.id)),
      page,
      limit,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    console.error("getFeed error:", error);
    return res.status(500).json({ message: "Failed to fetch feed" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    const posts = await Post.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate(postPopulateOptions);

    return res.status(200).json({
      posts: posts.map((p) => formatPost(p, req.user?.id)),
    });
  } catch (error) {
    console.error("getUserPosts error:", error);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user?.id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some((id) => String(id) === String(userId));

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => String(id) !== String(userId));
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      likeCount: post.likes.length,
      likedByMe: !alreadyLiked,
    });
  } catch (error) {
    console.error("toggleLike error:", error);
    return res.status(500).json({ message: "Failed to update like" });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      comment: text.trim(),
      commentedBy: userId,
    });

    post.comments.push(comment._id);
    await post.save();

    const populated = await Comment.findById(comment._id).populate(
      "commentedBy",
      "userName firstName lastName profilePic",
    );

    return res.status(201).json({
      comment: populated,
      commentCount: post.comments.length,
    });
  } catch (error) {
    console.error("addComment error:", error);
    return res.status(500).json({ message: "Failed to add comment" });
  }
};
