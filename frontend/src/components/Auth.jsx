import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

export default function Auth({ setIsLoggedIn }) {
  const MotionDiv = motion.div;
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [gender, setGender] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });

  const showMessage = (text, type = "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };
  const navigate = useNavigate();

  // Same-origin via Vite proxy so auth cookies are stored for :5173
  const apiRequest = async (url, data) => {
    const response = await api.post(url, data);
    return response.data;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      showMessage("Please enter username/email and password", "error");
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        identifier: loginIdentifier.trim(),
        password: loginPassword.trim(),
      };
      const data = await apiRequest("/api/users/login", payload);
      showMessage(
        data.message || "Login successful! Redirecting...",
        "success",
      );

      setTimeout(() => {
        setIsLoggedIn?.(true);
        navigate("/home"); // 🔥 THIS LINE
      }, 1000);
      // Reset form, optionally store token, redirect etc.
      setLoginIdentifier("");
      setLoginPassword("");
      // Example: window.location.href = "/dashboard";
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!userName.trim()) return showMessage("Username is required", "error");
    if (!email.trim()) return showMessage("Email is required", "error");
    if (!password.trim()) return showMessage("Password is required", "error");
    if (!firstName.trim())
      return showMessage("First name is required", "error");
    if (!lastName.trim()) return showMessage("Last name is required", "error");

    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailRegex.test(email))
      return showMessage("Valid email is required", "error");

    const trimmedUserName = userName.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 4) {
      return showMessage("Password must be at least 4 characters", "error");
    }
    if (gender && !["male", "female", "other"].includes(gender)) {
      return showMessage("Gender must be male, female, or other", "error");
    }

    const payload = {
      userName: trimmedUserName,
      email: trimmedEmail,
      password: trimmedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      profilePic: profilePic.trim() || undefined,
      gender: gender || undefined,
    };

    setIsLoading(true);
    try {
      const data = await apiRequest("/api/users/register", payload);
      showMessage(
        data.message || "Account created! Please sign in.",
        "success",
      );
      // Auto switch to login after success
      setTimeout(() => {
        setIsLogin(true);
        // Reset register form
        setUserName("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setProfilePic("");
        setGender("");
      }, 1500);
    } catch (err) {
      showMessage(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } },
  };

  return (
    <div className=" min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md">
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/80 overflow-hidden transition-all">
          {/* Decorative gradient top bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>

          {/* Toggle Buttons - Segmented Control Style */}
          <div className="flex gap-1 p-4 pb-2 bg-white/50 border-b border-gray-100">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                isLogin
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                !isLogin
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="p-6 pt-5">
            <AnimatePresence mode="wait">
              {isLogin ? (
                <MotionDiv
                  key="login"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email or Username
                      </label>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        placeholder="you@example.com or johndoe"
                        autoComplete="username"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Signing in...
                        </>
                      ) : (
                        "Sign in"
                      )}
                    </button>
                  </form>
                  <p className="text-center text-xs text-gray-400 mt-5">
                    Demo: any credentials (mock API endpoint)
                  </p>
                </MotionDiv>
              ) : (
                <MotionDiv
                  key="register"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          placeholder="Jane"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          placeholder="Doe"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username <span className="text-red-500">*</span>
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          (lowercase, unique)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) =>
                          setUserName(e.target.value.toLowerCase().trimStart())
                        }
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="johndoe"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="hello@example.com"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="at least 4 characters"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile picture URL
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={profilePic}
                        onChange={(e) => setProfilePic(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="https://example.com/avatar.jpg"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                        <span className="ml-1 text-xs font-normal text-gray-400">
                          (optional)
                        </span>
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                        disabled={isLoading}
                      >
                        <option value="">Prefer not to say</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </form>
                </MotionDiv>
              )}
            </AnimatePresence>

            {/* Global message */}
            <AnimatePresence>
              {message.text && (
                <MotionDiv
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={`mt-5 p-3 rounded-xl text-sm text-center font-medium ${
                    message.type === "error"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {message.text}
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center pb-5 opacity-30">
            <div className="h-0.5 w-10 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
