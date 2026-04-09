# Build stage
FROM node:20-bookworm AS builder

WORKDIR /app

# Install wkhtmltopdf on Debian
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    fontconfig \
    fonts-noto \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app

# Install wkhtmltopdf runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    fontconfig \
    fonts-noto \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npm run prisma:generate

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create directories
RUN mkdir -p logs uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start server
CMD ["node", "dist/server.js"]