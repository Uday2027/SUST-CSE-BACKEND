// Force restart -v10
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import { NotFoundError } from './utils/errors';
import { setupSwagger } from './config/swagger';
import { connectDB } from './config/database';

// Initialize DB (for serverless environments)
connectDB();

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // 1. Handle development/server-to-server requests (no origin)
    if (!origin) {
      return callback(null, true);
    }

    // 2. Parse the allowed origins from your env string
    // This turns "https://example.com, https://api.example.com" into an array
    const allowedOrigins = env.CLIENT_URL
      ? env.CLIENT_URL.split(',').map(o => o.trim().replace(/\/$/, ''))
      : [];

    // 3. Sanitize the incoming origin (remove trailing slashes)
    const sanitizedOrigin = origin.replace(/\/$/, '');

    // 4. Check if the origin is in our allowed list
    if (allowedOrigins.includes(sanitizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked for origin: ${origin}. Allowed: ${env.CLIENT_URL}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Parsing middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Swagger Documentation
setupSwagger(app);

// API routes
import router from './routes';
app.use('/api', router);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to SUST CSE Department API',
  });
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SUST CSE Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.all('*', (req: Request, res: Response, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global error handler
app.use(errorMiddleware);

export default app;
