import React, { useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

function AuthorAvatar({ user, size = "h-10 w-10" }) {
  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "?";

  if (user?.profilePic) {
    return (
      <img
        src={user.profilePic}
        alt=""
        className={`${size} rounded-full object-cover ring-2 ring-white/10`}
      />
    );
  }

  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-sm font-bold text-white`}
    >
      {initials}
    </div>
  );
}

export default function PostCard({ post: initialPost, onUpdate }) {
  const [post, setPost] = useState(initialPost);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [liking, setLiking] = useState(false);

  const author = post.createdBy;
  const authorId = author?._id || author;

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const res = await api.post(`/api/posts/${post._id}/like`);
      const updated = {
        ...post,
        likedByMe: res.data.likedByMe,
        likeCount: res.data.likeCount,
      };
      setPost(updated);
      onUpdate?.(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setLiking(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const res = await api.post(`/api/posts/${post._id}/comments`, {
        text: commentText.trim(),
      });
      const updated = {
        ...post,
        comments: [...(post.comments || []), res.data.comment],
        commentCount: res.data.commentCount,
      };
      setPost(updated);
      onUpdate?.(updated);
      setCommentText("");
      setShowComments(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Link to={`/user/${authorId}`}>
          <AuthorAvatar user={author} />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/user/${authorId}`}
            className="font-semibold text-white hover:underline"
          >
            {author?.firstName} {author?.lastName}
          </Link>
          <p className="text-xs text-white/50">@{author?.userName}</p>
        </div>
        {post.createdAt && (
          <time className="text-xs text-white/40">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </time>
        )}
      </div>

      {post.img && (
        <img
          src={post.img}
          alt=""
          className="w-full max-h-[480px] object-cover bg-black/40"
        />
      )}

      <div className="p-4 space-y-3">
        {post.description && (
          <p className="text-white/90 whitespace-pre-wrap">{post.description}</p>
        )}

        {post.hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-purple-300/90"
              >
                {tag.startsWith("#") ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-1">
          <button
            type="button"
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-1.5 text-sm transition ${
              post.likedByMe ? "text-pink-400" : "text-white/60 hover:text-pink-300"
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill={post.likedByMe ? "currentColor" : "none"}>
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {post.likeCount ?? 0}
          </button>

          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
              <path
                d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3H6a2 2 0 0 1-2-2V6Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            {post.commentCount ?? post.comments?.length ?? 0}
          </button>
        </div>

        {showComments && (
          <div className="space-y-3 border-t border-white/10 pt-3">
            {(post.comments || []).map((c) => (
              <div key={c._id} className="flex gap-2 text-sm">
                <AuthorAvatar user={c.commentedBy} size="h-8 w-8" />
                <div>
                  <span className="font-medium text-white/90">
                    @{c.commentedBy?.userName}
                  </span>
                  <p className="text-white/70">{c.comment}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handleComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
              />
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className="rounded-xl bg-purple-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}
