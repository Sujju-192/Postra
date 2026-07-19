import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* 🔥 Navbar */}
      <nav className="flex justify-between items-center px-10 py-5">
        <h1 className="text-2xl font-bold text-blue-500">CodeCollab</h1>
        <div className="space-x-6">
          <Link to="/auth" className="hover:text-blue-400">Login</Link>
          <Link to="/auth" className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 px-6">
        <h1 className="text-5xl font-extrabold leading-tight">
          Connect. Share. <span className="text-blue-500">Collaborate.</span>
        </h1>

        <p className="mt-6 text-gray-400 max-w-xl">
          A next-gen social platform where developers and creators connect,
          share ideas, collaborate in real-time, and build amazing things together.
        </p>

        <div className="mt-8 space-x-4">
          <Link
            to="/auth"
            className="bg-blue-500 px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
          >
            Get Started
          </Link>

          <button className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-800">
            Learn More
          </button>
        </div>
      </section>

      {/* 📱 Features Section */}
      <section className="mt-24 px-10 grid md:grid-cols-3 gap-10">

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-blue-400">Live Collaboration</h2>
          <p className="text-gray-400 mt-3">
            Code together in real-time with your team just like Google Docs.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-blue-400">Social Feed</h2>
          <p className="text-gray-400 mt-3">
            Share posts, follow developers, and stay updated with trends.
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-semibold text-blue-400">AI Assistant</h2>
          <p className="text-gray-400 mt-3">
            Get instant help, code suggestions, and debugging support.
          </p>
        </div>

      </section>

      {/* 🔥 CTA Section */}
      <section className="mt-24 text-center px-6">
        <h2 className="text-3xl font-bold">
          Ready to build something amazing?
        </h2>

        <Link
          to="/auth"
          className="inline-block mt-6 bg-blue-500 px-8 py-3 rounded-lg text-lg hover:bg-blue-600"
        >
          Join Now 🚀
        </Link>
      </section>

      {/* ⚡ Footer */}
      <footer className="mt-24 text-center text-gray-500 py-6 border-t border-gray-800">
        © 2026 CodeCollab. All rights reserved.
      </footer>
    </div>
  );
}