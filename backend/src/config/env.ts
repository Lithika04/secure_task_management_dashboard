
import dotenv from "dotenv";

// Load environment variables from .env file
// This runs once when server starts
dotenv.config();

// List of environment variables that MUST exist
const requiredVars = ["MONGODB_URI", "JWT_SECRET"] as const;

// Loop through required variables and throw error if missing
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}

// Extra security check: ensure JWT secret is strong
if ((process.env.JWT_SECRET || "").length < 32) {
  throw new Error("JWT_SECRET must be at least 32 characters long");
}

// Export validated environment variables
// Using 'as string' because we already validated they exist
export const env = {
  PORT: process.env.PORT || "5000", // Default port if not defined
  MONGODB_URI: process.env.MONGODB_URI as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
};
