import React from "react";

export default function Explore() {
  return (
    <div className="h-full w-full bg-black text-white overflow-auto">
      <div className="p-6">
        <h2 className="text-xl font-semibold">Explore</h2>
        <p className="mt-2 text-white/60">
          Discover posts, creators, and trending topics.
        </p>

        <div className="mt-6 grid gap-3">
          {["Trending", "People", "Topics"].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="font-semibold">{label}</div>
              <div className="text-sm text-white/60 mt-1">
                Coming soon.
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

