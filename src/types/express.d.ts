// src/types/express.d.ts
import { Server } from 'socket.io';
import { z } from 'zod';

declare global {
  namespace Express {
    interface Application {
      get(name: 'io'): Server;
    }
  }

  namespace Express {
    interface Request {
      validated?: {
        body: any;
        query: any;
        params: any;
      };
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
    }
  }

  
}
