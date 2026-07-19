import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function LeftPanel({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    api
      .get("/api/users/me")
      .then((res) => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  const displayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Loading...";
  const username = currentUser ? `@${currentUser.userName}` : "";
  const avatarInitials = currentUser
    ? `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase()
    : "?";

  const navItems = [
    {
      to: "/home",
      label: "Home",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      to: "/explore",
      label: "Explore",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M11 21a9 9 0 1 0-8.2-5.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 7l-2 6 6-2 2-6-6 2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      to: "/profile",
      label: "My profile",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M20 21a8 8 0 1 0-16 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsLoggedIn?.(false);
      navigate("/");
      setLoggingOut(false);
    }
  };
  return (
    <aside className="left-0 top-0 z-20 h-full w-80 shrink-0 bg-gradient-to-b from-black via-gray-950 to-black backdrop-blur-sm border-r border-white/10 shadow-2xl relative top-0 ">
      <div className="flex h-full flex-col px-5 py-6">
        {/* Brand Section with animated gradient */}
        <div className="group relative mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-purple-500/50">
              <div className="absolute inset-0 rounded-xl bg-white/20 blur-md group-hover:blur-lg" />
              <span className="relative text-lg font-bold text-white">P</span>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Postra
                </span>
                <span className="rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 backdrop-blur-sm">
                  BETA
                </span>
              </div>
              <div className="text-xs text-white/40">Social dashboard</div>
            </div>
          </div>
        </div>

        {/* Navigation with enhanced active states */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-white/15 to-white/5 text-white shadow-sm ring-1 ring-white/15"
                    : "text-white/60 hover:bg-white/5 hover:text-white hover:shadow-sm"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-purple-500 to-pink-500 shadow-sm" />
                  )}
                  <span
                    className={`transition-transform duration-200 group-hover:scale-105 ${
                      isActive ? "text-purple-300" : "text-white/70 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-1.5 text-[11px] font-bold text-white shadow-sm shadow-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section: User card + actions */}
        <div className="mt-auto space-y-4 pt-4">
          {/* Enhanced User Profile Card */}
          <div className="group relative rounded-xl bg-white/5 p-3 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:shadow-lg">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-base font-bold text-white shadow-md">
                  {avatarInitials}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-black" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white">{displayName}</span>
                </div>
                <span className="text-xs text-white/50">{username}</span>
              </div>
              <button
                type="button"
                className="rounded-full p-1.5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
                aria-label="Settings"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M19.4 15.05L18.1 16.75C17.8 17.15 17.3 17.4 16.8 17.4C16.6 17.4 16.3 17.35 16.1 17.25L14.2 16.3C13.8 16.1 13.2 16.1 12.8 16.3L10.9 17.25C10.5 17.45 9.9 17.45 9.5 17.25L7.6 16.3C7.2 16.1 6.9 15.7 6.9 15.3V12.7C6.9 12.3 7.1 11.9 7.5 11.7L9.4 10.75C9.8 10.55 10.4 10.55 10.8 10.75L12.7 11.7C13.1 11.9 13.7 11.9 14.1 11.7L16 10.75C16.4 10.55 17 10.55 17.4 10.75L19.3 11.7C19.7 11.9 20 12.3 20 12.7V15.3C20 15.7 19.8 16.1 19.4 16.3V15.05Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />

          {/* Action Buttons with animations */}
          <div className="space-y-2">
          <Link
  to="/create-post"
  className="group relative block w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 text-sm font-semibold text-white shadow-md shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/50 active:scale-[0.98]"
>
  <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

  <span className="relative flex items-center justify-center gap-2">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>

    Create post
  </span>
</Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="relative w-full rounded-xl bg-white/10 py-3 text-sm font-semibold text-white/80 shadow-sm transition-all duration-200 hover:bg-white/15 hover:text-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loggingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="30 30"
                      className="opacity-30"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Logging out...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path
                      d="M16 17L21 12M21 12L16 7M21 12H9M12 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}