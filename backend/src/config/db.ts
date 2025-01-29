import mongoose from "mongoose";
import { MONGO_URI } from "../utils/constants";

export const connectDB = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/mern-auth`);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed");
    process.exit(1);
  }
};