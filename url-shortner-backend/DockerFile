# ────────────────────────────────────────────────────────────────
# STAGE 1 — "builder"
# Goal: install ALL dependencies and compile TypeScript → JavaScript
# This stage is thrown away after building. Its node_modules and
# TypeScript toolchain never make it into the final image.
# ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files FIRST — before source code.
# Docker caches each layer. If package.json hasn't changed,
# the `npm ci` layer is reused from cache, saving 30–60 seconds
# on every rebuild. Copying source before this breaks the cache.
COPY package.json package-lock.json ./

# npm ci = clean install (uses package-lock.json exactly, no surprises)
RUN npm ci

# NOW copy source code — cache miss here won't re-run npm ci
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to JavaScript in the dist/ folder
RUN npm run build


# ────────────────────────────────────────────────────────────────
# STAGE 2 — "production"
# Goal: the smallest possible runnable image.
# We start fresh from node:20-alpine and copy ONLY what we need.
# ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Security best practice: never run as root inside a container.
# If an attacker exploits a bug in your app, they land as 'node'
# not 'root', limiting what they can do to the system.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only production dependencies (no TypeScript, no nodemon, no jest)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled JavaScript from the builder stage
# The builder stage is identified by "AS builder" above
COPY --from=builder /app/dist ./dist

# Switch to the non-root user
USER appuser

# Tell Docker this container listens on port 3000
# (This is documentation — it doesn't actually publish the port)
EXPOSE 3000

# Health check: Docker will call this every 30s.
# If it fails 3 times in a row, the container is marked "unhealthy"
# and docker compose / Kubernetes will restart it automatically.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# The command that runs when the container starts
CMD ["node", "dist/server.js"]