import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../middlewares/auth.middleware";
import { LoginInput, RegisterInput } from "../validators/auth.schemas";
import { env } from "../config/env";
// Register a New User
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body as RegisterInput;
 
    // Basic validation: ensure all required fields are provided
  
    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, Email, and Password are required" });
      return;
    }
    // Check if the user already exists in the database
  
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    // Create a new user instance
    //  password hashing should be handled in the User model pre-save hook

    const user = new User({
      name,
      email,
      password,
    });

    // Save the user to the database
    await user.save();
    // Respond with success message
  
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    // Handle duplicate email constraint (MongoDB code 11000)
    if ((error as any)?.code === 11000) {
      res.status(400).json({ message: "User already exists" });
      return;
    }
    next(error);
  }
};
// Login User
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginInput;

    // Basic validation: email and password must be provided
  
    if (!email || !password) {
      res.status(400).json({ message: "Email and Password are required" });
      return;
    }
    // Find the user by email
  
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    // Compare provided password with hashed password in DB
    // comparePassword should be a method in the User model
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    // Generate JWT token for authentication
    // Expires in 1 day
    const token = jwt.sign(
      { userId: user._id },
      env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Send token back to client
    // Client will use this token for authenticated requests
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get authenticated user profile
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.userId).select("name email");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
