
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { log } from "node:console";

dotenv.config();
const app= express();

app.use(express.json());

app.get("/health", (_req: Request,res: Response) => {
    res.status(200).json({status: "OK"});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log(`Server running on https://localhost:${PORT}`);

    
});