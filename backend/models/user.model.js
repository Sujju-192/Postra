import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "userName is required"],
        unique: true,
        lowercase: true,
        trim: true, 
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true, 
    },
    email: { 
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true, // ✅ fixed
        trim: true, 
    },
    firstName: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    profilePic: String,
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    refreshToken: String
}, { timestamps: true });

// 🔐 Hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// 🔐 Compare password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password); // ✅ return
};

export const User = mongoose.model("User", userSchema);