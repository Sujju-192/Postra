import React, { useState, useRef, useEffect } from "react";
import api from "../api/axios.js";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);

  // Character limit for tweet
  const MAX_CHARS = 280;

  // Auto-clear status message after 3 seconds
  useEffect(() => {
    if (submitStatus.message) {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: "", message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSubmitStatus({ type: "error", message: "Please select an image file." });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSubmitStatus({ type: "error", message: "Image size must be less than 5MB." });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!content.trim() && !imageFile) {
      setSubmitStatus({ type: "error", message: "Please enter some text or add an image." });
      return;
    }

    if (content.length > MAX_CHARS) {
      setSubmitStatus({ type: "error", message: `Content exceeds ${MAX_CHARS} characters.` });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: "", message: "" });
    console.log("Ab tak kuch nhi hua");
    try {
      const formData = new FormData();
      formData.append("description", content);
      formData.append("hashtags", hashtags); // CSV string, backend will split
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await api.post("/api/posts", formData, {
        withCredentials: true,
        timeout: 10000,
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("response mil gya");
      if (response.status === 201) {
        setSubmitStatus({ type: "success", message: "Post created successfully!" });
        // Reset form
        setContent("");
        setHashtags("");
        removeImage();
      } else {
        setSubmitStatus({ type: "error", message: response.data.message || "Failed to create post." });
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus({
        type: "error",
        message: err?.response?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="mx-auto max-w-2xl px-6 py-8 md:px-8 lg:py-10">
        {/* header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-10 w-1 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Post</h1>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/60 backdrop-blur-sm">Share your thoughts</span>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main content area with glass effect */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all duration-200 hover:border-white/20 hover:shadow-xl">
            {/* Textarea for tweet content */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
                placeholder="What's on your mind? Share your thoughts..."
                rows={4}
                className="w-full resize-none bg-transparent text-white placeholder-white/40 focus:outline-none text-lg"
              />
              <div className="mt-2 flex justify-between text-xs text-white/40">
                <span>Write something meaningful</span>
                <span className={content.length > MAX_CHARS ? "text-red-400" : ""}>
                  {content.length}/{MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Image Preview Section */}
            {imagePreview && (
              <div className="relative mt-4 rounded-xl border border-white/10 overflow-hidden group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 w-full object-contain bg-black/40"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white/80 transition hover:bg-red-500/80 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}

            {/* Image upload button */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-white/20 px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Add image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-xs text-white/30">JPG, PNG, GIF up to 5MB</span>
            </div>
          </div>

          {/* Hashtags section */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 transition-all duration-200 hover:border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-purple-400" fill="none">
                <path d="M7 8l5-5 5 5M7 16l5 5 5-5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 4L10 20" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <label className="text-sm font-medium text-white/80">Hashtags (comma separated)</label>
            </div>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="e.g., technology, coding, life"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <p className="mt-2 text-xs text-white/30">
              Separate multiple hashtags with commas. They will be automatically prefixed with #
            </p>
          </div>

          {/* Status message */}
          {submitStatus.message && (
            <div
              className={`rounded-xl p-3 text-sm ${
                submitStatus.type === "success"
                  ? "border border-green-500/30 bg-green-500/10 text-green-200"
                  : "border border-red-500/30 bg-red-500/10 text-red-200"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white shadow-md shadow-purple-500/30 transition-all duration-200 hover:scale-[1.02] hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            {isSubmitting ? (
              <span className="relative flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 30" className="opacity-30" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Publishing...
              </span>
            ) : (
              <span className="relative flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                Post Now
              </span>
            )}
          </button>
        </form>

        {/* Tips card */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-purple-400 shrink-0" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <div className="text-xs text-white/50 leading-relaxed">
              <span className="font-medium text-white/80">Pro tip:</span> Add relevant hashtags to reach a wider audience. Posts with images get up to 2x more engagement!
            </div>
          </div>
        </div>
        </div>
    </div>
  );
}