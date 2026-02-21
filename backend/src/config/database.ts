
import mongoose from "mongoose";
import { env } from "./env";


const connectDatabase = async (): Promise<void> => {
  try {
    // Fail fast if MongoDB isn't reachable instead of hanging indefinitely.
    await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("MongoDB connected");
  } catch (error) {
    console.error(
      "MongoDB connection failed. Is MongoDB running at",
      env.MONGODB_URI,
      "?"
    );
    throw error;
  }
};
export default connectDatabase;
