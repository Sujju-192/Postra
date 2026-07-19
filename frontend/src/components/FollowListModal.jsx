import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

export default function FollowListModal({ userId, type, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const title = type === "followers" ? "Followers" : "Following";
  const endpoint =
    type === "followers"
      ? `/api/users/${userId}/followers`
      : `/api/users/${userId}/followings`;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get(endpoint);
        if (mounted) setUsers(res.data.users || []);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [endpoint, userId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-950 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-white/60 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {loading ? (
            <p className="py-8 text-center text-sm text-white/50">Loading...</p>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/50">No users yet.</p>
          ) : (
            users.map((user) => (
              <Link
                key={user._id}
                to={`/user/${user._id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-sm font-bold text-white">
                  {(user.firstName?.[0] || "") + (user.lastName?.[0] || "")}
                </div>
                <div>
                  <p className="font-medium text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-white/50">@{user.userName}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
