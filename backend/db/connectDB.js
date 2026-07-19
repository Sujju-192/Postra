import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async() => {
    try {
        const rawUri = process.env.MONGODB_URI;
        if (!rawUri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        const uri = new URL(rawUri);
        const hasDbInUri = uri.pathname && uri.pathname !== "/" && uri.pathname.trim() !== "";
        const finalUri = hasDbInUri ? rawUri : `${rawUri.replace(/\/+$/, "")}/${DB_NAME}`;

        await mongoose.connect(finalUri);
        console.log("\nMONGODB Successfully Connected!!!");
    } catch (error) {
        console.log("MONGO DB ERROR: " + error)
        throw error;
    }
}