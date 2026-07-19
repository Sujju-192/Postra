import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

export default function UserSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/users/search", {
          params: { q: query.trim() },
        });
        setResults(res.data.users || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const toggleFollow = async (user) => {
    setFollowLoading(user._id);
    try {
      if (user.isFollowing) {
        await api.delete(`/api/users/${user._id}/follow`);
      } else {
        await api.post(`/api/users/${user._id}/follow`);
      }
      setResults((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, isFollowing: !u.isFollowing } : u,
        ),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setFollowLoading(null);
    }
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-white/40" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or username..."
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none"
        />
        {loading && (
          <span className="text-xs text-white/40">Searching...</span>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/10 bg-gray-950 shadow-xl">
          {results.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 border-b border-white/5 px-4 py-3 last:border-0"
            >
              <Link
                to={`/user/${user._id}`}
                className="flex min-w-0 flex-1 items-center gap-3"
                onClick={() => setQuery("")}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-sm font-bold text-white">
                  {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-xs text-white/50">@{user.userName}</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => toggleFollow(user)}
                disabled={followLoading === user._id}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  user.isFollowing
                    ? "bg-white/10 text-white/80 hover:bg-white/15"
                    : "bg-purple-600 text-white hover:bg-purple-500"
                }`}
              >
                {user.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
