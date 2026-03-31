import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    img: {
        type: String,
        trim: true, 
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    description: { 
        type: String,
        trim: true, 
    },
    hashtags: {
        type: String,
        required: true,
        trim: true, 
        index: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment" 
    }],
}, {timestamps: true});

export const Post = mongoose.model("Post", userSchema);