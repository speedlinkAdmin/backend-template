import SSE from 'express-sse';
import { EventEmitter } from 'events';
import { logger } from './logger';

// Event emitter for internal app communication
const sseEventEmitter = new EventEmitter();

// Singleton SSE instance
let sseInstance: SSE | null = null;
let isInitialized = false;

/**
 * SSE Topics/Events you can use
 */
export const SSE_EVENTS = {
  DASHBOARD: 'dashboard',
  NOTIFICATION: 'notification',
  ALERT: 'alert',
  CHAT: 'chat',
  METRICS: 'metrics',
} as const;

export type SSEEventType = typeof SSE_EVENTS[keyof typeof SSE_EVENTS];

/**
 * Initialize SSE (call once in server.ts)
 */
export function initSSE(initialData: any[] = []) {
  if (isInitialized) {
    logger.warn('SSE already initialized');
    return sseInstance;
  }
  
  sseInstance = new SSE(initialData, { isSerialized: false });
  isInitialized = true;
  
  logger.info('✅ SSE initialized successfully');
  return sseInstance;
}

/**
 * Get SSE middleware for Express route
 */
export function getSSEMiddleware() {
  if (!sseInstance) {
    throw new Error('SSE not initialized. Call initSSE() first.');
  }
  return sseInstance.init;
}

/**
 * Send data to all connected clients
 */
export function broadcast(event: SSEEventType, data: any, customId?: string) {
  if (!sseInstance) {
    logger.error('Cannot broadcast: SSE not initialized');
    return false;
  }
  
  const message = {
    event,
    data,
    timestamp: new Date().toISOString()
  };
  
  if (customId) {
    sseInstance.send(message, event, customId);
  } else {
    sseInstance.send(message, event);
  }
  
  logger.debug(`📡 Broadcasted "${event}" to all clients`);
  return true;
}

/**
 * Send to specific client (by connection ID)
 * Note: express-sse doesn't support targeting by default, this is a workaround
 * For true targeted SSE, consider upgrading to @dachendev/express-sse
 */
export function sendToClient(clientId: string, event: SSEEventType, data: any) {
  // This is a limitation of express-sse - it broadcasts to all
  // For targeted SSE, you'd need a different library or track connections
  logger.warn(`Targeted SSE (client ${clientId}) not supported by express-sse. Broadcasting instead.`);
  broadcast(event, data);
}

/**
 * Get SSE instance (for advanced use)
 */
export function getSSE(): SSE | null {
  return sseInstance;
}

/**
 * Check if SSE is ready
 */
export function isSSEReady(): boolean {
  return isInitialized && sseInstance !== null;
}

/**
 * Event emitter for internal app communication
 * Use this to trigger SSE events from anywhere in your app
 */
export const onSSEEvent = sseEventEmitter;

// Listen for internal events and broadcast to SSE clients
sseEventEmitter.on('sse:broadcast', ({ event, data }) => {
  broadcast(event, data);
});

// Helper to emit internal events
export function emitSSEEvent(event: SSEEventType, data: any) {
  sseEventEmitter.emit('sse:broadcast', { event, data });
}