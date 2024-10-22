import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDb } from "./config/connectDB.js";
import authRoute from "./routes/auth.route.js";
import { notFound } from "./middleware/notFund.js";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // // When set to true, the server allows the client to include credentials (like cookies) with requests, making it possible to maintain sessions between the frontend and backend. In order to work, you should add a little config, see authStore.js file
app.use(express.json());

app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoute);

//  configuration. Code below serves the production build of the frontend (e.g., a React or Vue app) when the server is running in production mode.
// This is a common setup for deploying a full-stack application where the backend is built with Express, and the frontend is bundled into static files (e.g., with Webpack or Vite) and served from a dist or build folder.
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFIle(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use(notFound, errorHandler);

app.listen(PORT, () => {
  connectDb();
  console.log(`Serving is running at port ${PORT}`);
});
