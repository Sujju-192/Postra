import React, { useEffect, useState } from "react";
import api from "./api/axios.js";
import { Routes, Route } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import HomePage from "./components/HomePage";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import Auth from "./components/Auth";
import Landing from "./components/Landing";
import CreatePost from "./components/CreatePost";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/api/users/profile", {
          withCredentials: true,
          timeout: 5000,
        });

        if (res.data.user) {
          setIsLoggedIn(true);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkUser();
  }, []);


  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {!isLoggedIn ? (
        <>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
        </>
      ) : (
        <>
          <Route element={<AppLayout setIsLoggedIn={setIsLoggedIn} />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:userId" element={<Profile />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </>
      )}
    </Routes>
  );
}
