import React from "react";
import FeedPanel from "./FeedPanel";
import RightPanel from "./RightPanel";

export default function HomePage() {
  return (
    <div className="h-full w-full bg-black overflow-hidden flex">
      <div className="h-full min-h-0 flex-1 flex">
        <FeedPanel />
        <div className="hidden lg:block w-[360px] shrink-0 border-l border-white/10">
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
