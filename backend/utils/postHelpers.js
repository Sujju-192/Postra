const authorSelect = "userName firstName lastName profilePic";

export const postPopulateOptions = [
  { path: "createdBy", select: authorSelect },
  {
    path: "comments",
    options: { sort: { createdAt: 1 } },
    populate: { path: "commentedBy", select: authorSelect },
  },
];

export function formatPost(post, currentUserId) {
  const doc = post.toObject ? post.toObject() : post;
  const likedByMe = currentUserId
    ? doc.likes?.some((id) => String(id) === String(currentUserId) ||
        String(id?._id) === String(currentUserId))
    : false;

  return {
    ...doc,
    likeCount: doc.likes?.length ?? 0,
    likedByMe,
    commentCount: doc.comments?.length ?? 0,
  };
}
