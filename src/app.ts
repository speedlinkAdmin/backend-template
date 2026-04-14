import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimiter } from '@middlewares/rate-limiter.middleware';
import { errorHandler } from '@middlewares/error.middleware';
import { initSSE, getSSEMiddleware } from './lib/sse';

// Import feature routes
import * as features from '@features';

import passport from '@lib/passport';
import { setupSwagger } from '@docs/swagger';
import ResponseUtil from '@utils/response.util';

const app = express();

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         rememberMe:
 *           type: boolean
 *           default: false
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 */

// Passport initialization
app.use(passport.initialize());

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGINS.split(','),
  credentials: true,
  methods: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
}));
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Swagger documentation
setupSwagger(app);

// Initialize SSE (BEFORE mounting routes)
initSSE(['Live dashboard ready']);

// SSE endpoint - clients connect here
app.get('/events', getSSEMiddleware());


// Health check
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/health', (_, res) => {
  ResponseUtil.success(res, { status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', features.authRoutes);
app.use('/api/notifications', features.notificationRoutes);
app.use('/api/user', features.userRoutes);

// 404 handler
app.use((_, res) => {
  ResponseUtil.error(res, 'Route not found', 404);
});

// Global error handler
app.use(errorHandler);

export { app };