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

# Enable Corepack
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm prisma:generate

# Build TypeScript
RUN pnpm build

# Production stage
FROM node:20-bookworm-slim

WORKDIR /app

# Enable Corepack
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# Install wkhtmltopdf runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wkhtmltopdf \
    fontconfig \
    fonts-noto \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN pnpm prisma:generate

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