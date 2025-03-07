import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path"; // Import the path module
import { fileURLToPath } from "url"; // Required for ES modules to get __dirname

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(json({ limit: "64kb" }));
app.use(urlencoded({ extended: true, limit: "64kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes import
import router from "./routes/index.js";
import userRouter from "./routes/user.routes.js";

// Routes declaration
app.use("/api/v1", router);
app.use("/api/v1/user", userRouter);

export { app };