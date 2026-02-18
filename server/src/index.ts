
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/database";
import { log } from "node:console";
import { env } from "node:process";

dotenv.config();
const app= express();
//Middleware section

//Enalble CORS to allow frontend connection
app.use(
  cors({
    origin: env.FRONTEND_URL, // Only allow requests from frontend URL
    credentials: true,
  })
);

// parse incoming JSON reques bodies
app.use(express.json());
//basic health check
app.get("/health", (_req: Request,res: Response) => {
    res.status(200).json({status: "OK"});
});

// ==========================
// Server Startup Function
// ==========================

/**
 * start server only AFTER database connects.
 * This prevents app from running without DB.
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDatabase();

    // Start Express server
    app.listen(Number(env.PORT), () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    // If database fails → stop app completely
    console.error("Server startup failed:", error);
    process.exit(1); // Exit with failure code
  }
};

// Call startup function
void startServer();