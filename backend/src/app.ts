import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import type { Request, Response } from "express";
import { errorMiddleware } from "./middlewares/error.middleware";
import { errorResponse } from "./utils/apiResponse.utils";
import { swaggerSpec } from "./config/swagger";
import v1Router from "./routes/v1";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "OK" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use("/api/v1", v1Router);

app.use((req: Request, res: Response) => {
  return errorResponse(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
});

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

export default app;
