
import mongoose from "mongoose";
import { env } from "./env";


//establish connection using mongoose
const connectDatabase =async(): Promise<void> => {
    await mongoose.connect(env.MONGODB_URI); //Attempt to connect using validates MongoDB URI
    console.log("MongoDB connected");   
};
export default connectDatabase;
