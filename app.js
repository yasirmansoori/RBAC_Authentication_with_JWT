// Dependencies
const express = require('express');
const db = require("./src/db/db");
const cors = require('cors');
const authRoute = require('./src/routes/auth.route');
const adminRoute = require('./src/routes/admin.route');
const { authorize, authenticate } = require('./src/middlewares/auth');
const { notFoundMiddleware, defaultErrorHandler } = require('./src/middlewares/error');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const morgan = require('morgan');

// Environment variables
const PORT = process.env.PORT || 3001;
const CONNECTION_STRING = `${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`;

// Logger configuration using Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ],
});

// Connect the database
db.connect(CONNECTION_STRING)
  .then(() => {
    logger.info("Database connected.");
  })
  .catch((err) => {
    logger.error(`Database connection error: ${err.message}`);
  });

// Configure
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HTTP request logging using Morgan
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Routes
app.get('/', (req, res) => {
  logger.info("Root route accessed.");
  res.status(200).json({ message: "If you see this message, Thank god! Your server is running." });
});

// Admin specific routes
app.use("/api/v1/admin/", authenticate, authorize(["admin"]), adminRoute);

// auth routes
app.use("/api/v1/", authRoute);

// 404 Not Found middleware
app.use(notFoundMiddleware);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  defaultErrorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  logger.info(`Server is listening on http://localhost:${PORT}`);
});
