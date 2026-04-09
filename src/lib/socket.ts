import { Server, Socket } from 'socket.io';
import http from 'http';
import jwt from 'jsonwebtoken';
import { logger } from '@lib/logger';

let io: Server;

export function initSocket(server: http.Server): Server {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });
  
  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication required'));
      }
      
      const decoded = jwt.verify(token, env.JWT_SECRET);
      socket.data.userId = (decoded as any).sub;
      next();
    } catch (error) {
      next(new Error('Invalid token'));
    }
  });
  
  // Connection handler
  io.on('connection', (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.data.userId})`);
    
    // Join user's personal room
    if (socket.data.userId) {
      socket.join(`user:${socket.data.userId}`);
    }
    
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });
  
  logger.info('✅ Socket.io initialized');
  return io;
}

export function getIo(): Server {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket first.');
  }
  return io;
}

// Helper functions
export function emitToUser(userId: string, event: string, data: any) {
  getIo().to(`user:${userId}`).emit(event, data);
}

export function emitToRoom(roomId: string, event: string, data: any) {
  getIo().to(roomId).emit(event, data);
}

export function emitToAll(event: string, data: any) {
  getIo().emit(event, data);
}

export function broadcastToUsers(userIds: string[], event: string, data: any) {
  const rooms = userIds.map(id => `user:${id}`);
  getIo().to(rooms).emit(event, data);
}