import React from "react";
import { Outlet } from "react-router-dom";
import LeftPanel from "./LeftPanel";

export default function AppLayout({ setIsLoggedIn }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black">
      <LeftPanel setIsLoggedIn={setIsLoggedIn} />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}