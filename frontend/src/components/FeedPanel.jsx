import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios.js";
import PostCard from "./PostCard";
import UserSearchBar from "./UserSearchBar";

export default function FeedPanel() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);
  const fetchingRef = useRef(false);

  const fetchFeed = useCallback(async (pageNum, append = false) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await api.get("/api/posts/feed", {
        params: { page: pageNum, limit: 10 },
      });
      const newPosts = res.data.posts || [];
      setPosts((prev) => (append ? [...prev, ...newPosts] : newPosts));
      setHasMore(res.data.hasMore);
      setPage(pageNum);
    } catch (e) {
      console.error("Feed load failed", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchFeed(1, false);
  }, [fetchFeed]);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fetchingRef.current) {
          fetchFeed(page + 1, true);
        }
      },
      { rootMargin: "200px" },
    );

    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [hasMore, loading, loadingMore, page, fetchFeed]);

  const handlePostUpdate = (updated) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p)),
    );
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-black">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Home</h1>
          <p className="text-sm text-white/50">Latest posts from everyone</p>
        </div>

        <UserSearchBar />

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="py-12 text-center text-white/50">
            No posts yet. Be the first to share something!
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handlePostUpdate}
              />
            ))}
          </div>
        )}

        <div ref={loaderRef} className="py-6 text-center">
          {loadingMore && (
            <span className="text-sm text-white/40">Loading more...</span>
          )}
          {!hasMore && posts.length > 0 && (
            <span className="text-sm text-white/30">You&apos;re all caught up</span>
          )}
        </div>
      </div>
    </div>
  );
}
