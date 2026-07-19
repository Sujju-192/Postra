import React, { useCallback, useEffect, useState } from "react";
import api from "../api/axios.js";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";
import FollowListModal from "./FollowListModal";

export default function Profile() {
  const { userId: routeUserId } = useParams();
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [listModal, setListModal] = useState(null);

  const isOwnProfile = !routeUserId || user?.isSelf;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const meRes = await api.get("/api/users/me");

      const profileRes = routeUserId
        ? await api.get(`/api/users/${routeUserId}`)
        : meRes;

      const profileUser = routeUserId ? profileRes.data.user : meRes.data.user;
      setUser({
        ...profileUser,
        isSelf: !routeUserId || String(profileUser._id) === String(meRes.data.user._id),
        followerCount: profileUser.followers?.length ?? profileUser.followerCount ?? 0,
        followingCount: profileUser.followings?.length ?? profileUser.followingCount ?? 0,
        postCount: profileUser.posts?.length ?? profileUser.postCount ?? 0,
      });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [routeUserId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!user?._id) return;

    let mounted = true;
    setLoadingPosts(true);
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/api/posts/user/${user._id}`);
        if (mounted) setPosts(res.data.posts || []);
      } catch (e) {
        console.error("Failed to load posts", e);
      } finally {
        if (mounted) setLoadingPosts(false);
      }
    };
    fetchPosts();
    return () => {
      mounted = false;
    };
  }, [user?._id]);

  const toggleFollow = async () => {
    if (!user || user.isSelf) return;
    setFollowLoading(true);
    try {
      if (user.isFollowing) {
        const res = await api.delete(`/api/users/${user._id}/follow`);
        setUser((u) => ({
          ...u,
          isFollowing: false,
          followerCount: res.data.followerCount,
        }));
      } else {
        const res = await api.post(`/api/users/${user._id}/follow`);
        setUser((u) => ({
          ...u,
          isFollowing: true,
          followerCount: res.data.followerCount,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFollowLoading(false);
    }
  };

  const getInitials = () => {
    if (!user) return "";
    return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
  };

  const postCount = posts.length;
  const followerCount = user?.followerCount ?? user?.followers?.length ?? 0;
  const followingCount = user?.followingCount ?? user?.followings?.length ?? 0;

  return (
    <div className="min-h-full w-full bg-gradient-to-b from-black via-gray-950 to-black overflow-auto">
      {listModal && (
        <FollowListModal
          userId={user._id}
          type={listModal}
          onClose={() => setListModal(null)}
        />
      )}

      <div className="mx-auto max-w-3xl px-6 py-8 md:px-8 lg:py-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isOwnProfile ? "My Profile" : "Profile"}
          </h1>
        </div>

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-40 rounded-3xl bg-white/5" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        ) : !user ? (
          <p className="text-white/60">No user data.</p>
        ) : (
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
                {user.profilePic ? (
                  <img
                    src={user.profilePic}
                    alt=""
                    className="h-24 w-24 rounded-2xl object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-3xl font-bold text-white">
                    {getInitials() || "U"}
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="mt-1 text-white/60">@{user.userName}</p>
                </div>
                {!user.isSelf && (
                  <button
                    type="button"
                    onClick={toggleFollow}
                    disabled={followLoading}
                    className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                      user.isFollowing
                        ? "border border-white/20 bg-white/10 text-white"
                        : "bg-purple-600 text-white hover:bg-purple-500"
                    }`}
                  >
                    {user.isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>

            {isOwnProfile && user.email && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm text-white/50">Email</div>
                  <div className="mt-0.5 font-medium text-white">{user.email}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="text-sm text-white/50">Gender</div>
                  <div className="mt-0.5 font-medium text-white">
                    {user.gender
                      ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                      : "Not specified"}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-center">
              <div>
                <div className="text-xl font-bold text-white">{postCount}</div>
                <div className="text-xs text-white/40">Posts</div>
              </div>
              <button
                type="button"
                onClick={() => setListModal("followers")}
                className="rounded-lg transition hover:bg-white/5"
              >
                <div className="text-xl font-bold text-white">{followerCount}</div>
                <div className="text-xs text-white/40">Followers</div>
              </button>
              <button
                type="button"
                onClick={() => setListModal("followings")}
                className="rounded-lg transition hover:bg-white/5"
              >
                <div className="text-xl font-bold text-white">{followingCount}</div>
                <div className="text-xs text-white/40">Following</div>
              </button>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/40">
                {isOwnProfile ? "Your posts" : "Posts"} ({postCount})
              </h3>

              {loadingPosts ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/5" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <p className="py-8 text-center text-white/50">No posts yet.</p>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onUpdate={(updated) =>
                        setPosts((prev) =>
                          prev.map((p) => (p._id === updated._id ? updated : p)),
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
