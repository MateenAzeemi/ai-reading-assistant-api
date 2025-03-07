// import express, { json, urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
import router from "./routes/index.js";
import cookieParser from "cookie-parser";
import { app } from "./app.js";

config({ path: "./.env" });

const PORT = process.env.PORT || 5000;
// const app = express();

// app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
// app.use(json({ limit: "64kb" }));
// app.use(urlencoded({ extended: true, limit: "64kb" }));
// app.use(express.static("public"));
// app.use(cookieParser())

// app.use("/api/v1", router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api/v1`);
});