
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "./config/database";
import { env } from "./config/env";
import { protect } from "./middlewares/auth.middleware";
import { notFound, errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";
import  swaggerSpec  from "./config/swagger";
import swaggerUi from "swagger-ui-express";
 

dotenv.config();
const app= express();
//Middleware 


//Enalble CORS to allow frontend connection
// Restrict browser origins to trusted frontend URL; allow non-browser tools without origin.
app.use(cors({
  origin: [
    "http://localhost:5173",  // Vite frontend
    "http://localhost:3000",  // fallback
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json()) // Parse incoming JSON requests
app.use("/api/auth", authRoutes) // Auth routes: register & login
app.use("/api/tasks", taskRoutes) // Task routes: CRUD operations
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req, res) => res.json(swaggerSpec));


//basic health check
app.get("/health", (_req: Request,res: Response) => {
    res.status(200).json({status: "OK"});
});

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You accessed protected route!" }) // Only accessible with valid JWT
})

// Standard handlers for unknown routes and unexpected runtime errors.
app.use(notFound)
app.use(errorHandler)
// Server Startup Function

// start server only AFTER database connects.
//This prevents app from running without DB.

const startServer = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDatabase() // Initialize MongoDB connection

    app.listen(Number(env.PORT), () => {
      console.log(`Server running on http://localhost:${env.PORT}`)
      console.log(
        `Swagger Docs available at http://localhost:${env.PORT}/api-docs`
      )
    })
  } catch (error) {
    console.error("Server startup failed:", error)
    process.exit(1)
  }
}

void startServer()
