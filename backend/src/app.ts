import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/errorHandler.js";
import { router } from "./routes/index.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);