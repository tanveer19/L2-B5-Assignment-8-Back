import cors from "cors";
import routes from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import express, { Request, Response } from "express";

const app = express();

app.use(cors());
app.use(express.json());

// Register root route FIRST
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "A8",
  });
});

// Register API routes
app.use("/api", routes);

// Error handlers AFTER routes
app.use(globalErrorHandler);
app.use(notFound);

export default app;
