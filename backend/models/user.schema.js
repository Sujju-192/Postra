import mongoose from "mongoose";

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
        lowecase: true,
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
    gender: {
        type: String,
        enum: ["male", "female", "other"]
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], 
    followings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], 
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);