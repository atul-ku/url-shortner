# ────────────────────────────────────────────────────────────────
# STAGE 1 — "builder"
# Goal: install dependencies and run `vite build`
# Produces a dist/ folder of optimised static files (HTML, CSS, JS)
# ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Same cache trick as the API Dockerfile:
# copy package files first so npm ci is cached between rebuilds
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite compiles and bundles the entire React app into dist/
# All TypeScript is stripped, JSX is compiled, assets are hashed
RUN npm run build


# ────────────────────────────────────────────────────────────────
# STAGE 2 — "production"
# Goal: serve the dist/ folder using Nginx
# The final image has NO Node.js at all — just a tiny Nginx server.
# This makes the image ~25 MB instead of ~200 MB.
# ────────────────────────────────────────────────────────────────
FROM nginx:1.25-alpine AS production

# Remove the default Nginx welcome page config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config (handles SPA routing + API proxy)
COPY nginx/nginx.conf /etc/nginx/conf.d/app.conf

# Copy the compiled React app from the builder stage
# Nginx serves files from /usr/share/nginx/html by default
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Nginx runs in the foreground so Docker can track the process
CMD ["nginx", "-g", "daemon off;"]