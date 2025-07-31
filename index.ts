
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import winston from "winston";
import morgan from "morgan";
import dotenv from "dotenv";

// Load env vars
dotenv.config();

// Environment Variables
const PORT = process.env.PORT || 3001;
const CONNECTION_STRING = `${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`;

// Logger configuration using Winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
  ],
});

// Connect to MongoDB
db.connect(CONNECTION_STRING)
  .then(() => {
    logger.info("Database connected.");
  })
  .catch((err: Error) => {
    logger.error(`Database connection error: ${err.message}`);
  });

// Express App Setup
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Morgan for HTTP request logging
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  })
);

// Root route
app.get("/", (req: Request, res: Response) => {
  logger.info("Root route accessed.");
  res.status(200).json({
    message: "If you see this message, Thank god! Your server is running.",
  });
});

// Admin protected routes
app.use("/api/v1/admin/", authenticate, authorize(["admin"]), adminRoute);

// Auth routes
app.use("/api/v1/", authRoute);

// 404 Middleware
app.use(notFoundMiddleware);

// Global Error Handler
app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Error occurred: ${err.message}`);
    defaultErrorHandler(err, req, res, next);
  }
);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is listening on http://localhost:${PORT}`);
});
