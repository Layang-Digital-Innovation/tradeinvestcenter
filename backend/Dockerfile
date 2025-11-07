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

# Build NestJS app (skip prisma generate at build to avoid missing env)
RUN npm run build

EXPOSE 3001
ENV NODE_ENV=production

# Generate Prisma client and run migrations at container start (envs are available)
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node dist/main"]
