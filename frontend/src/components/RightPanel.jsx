import React from "react";

export default function RightPanel() {
  return (
    <div className="h-full w-full bg-black bg-[radial-gradient(circle_at_80%_45%,rgba(168,85,247,0.35)_0%,rgba(0,0,0,1)_70%)]">
      <div className="p-5 text-white">
        <div className="text-sm font-semibold text-white/90">For you</div>
        <div className="mt-3 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-semibold">Suggestions</div>
            <div className="text-sm text-white/60 mt-1">Coming soon.</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="font-semibold">Trending</div>
            <div className="text-sm text-white/60 mt-1">Coming soon.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
