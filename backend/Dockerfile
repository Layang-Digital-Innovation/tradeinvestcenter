FROM node:20-bookworm-slim AS base
WORKDIR /app

# Install OpenSSL to satisfy Prisma runtime requirements
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

# Provide placeholder DATABASE_URL so prisma generate can read schema
ENV DATABASE_URL="postgresql://postgres:admin123@trade-invest-center-dbtradeinvestcenter-guhia7:5432/db_tradeinvestcenter"

# Generate Prisma client for TypeScript compilation
RUN npx prisma generate

# Build NestJS app
RUN npm run build

EXPOSE 3001
ENV NODE_ENV=production

# Run migrations at container start (envs provided by Dokploy)
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
