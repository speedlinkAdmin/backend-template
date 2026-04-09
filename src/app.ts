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

const app = express();

// Passport initialization
app.use(passport.initialize());

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Initialize SSE (BEFORE mounting routes)
initSSE(['Live dashboard ready']);

// SSE endpoint - clients connect here
app.get('/events', getSSEMiddleware());


// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', features.authRoutes);
app.use('/api/notifications', features.notificationRoutes);
app.use('/api/user', features.userRoutes);

// 404 handler
app.use((_, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export { app };