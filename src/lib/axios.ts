import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { logger } from './logger';

// ─── Base HTTP Client ────────────────────────────────────────────────────────

function createHttpClient(baseURL: string, config: AxiosRequestConfig = {}): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 10_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...config,
  });

  // ── Request interceptor ──────────────────────────────────────────────────
  instance.interceptors.request.use(
    (req) => {
      logger.debug(`→ ${req.method?.toUpperCase()} ${req.baseURL}${req.url}`);
      return req;
    },
    (error: AxiosError) => {
      logger.error('Request error:', error.message);
      return Promise.reject(error);
    }
  );

  // ── Response interceptor ─────────────────────────────────────────────────
  instance.interceptors.response.use(
    (res: AxiosResponse) => {
      logger.debug(`← ${res.status} ${res.config.url}`);
      return res;
    },
    (error: AxiosError) => {
      const status = error.response?.status;
      const url = error.config?.url;

      if (status === 401) {
        logger.warn(`Unauthorized request to ${url}`);
      } else if (status === 429) {
        logger.warn(`Rate limited on ${url}`);
      } else {
        logger.error(`HTTP ${status ?? 'ERR'} on ${url}:`, error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

export const httpClient = createHttpClient(
  env.APP_URL || 'http://localhost:3000'
);

export { createHttpClient };
export default httpClient;
