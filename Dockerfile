# Stage 1: Install and Build
FROM node:18.20.3-alpine3.20 AS builder

RUN apk add --no-cache nano bash libc6-compat python3 make g++ git

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm install autoprefixer postcss --save-dev
RUN npx eslint --fix . || true
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built files
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.ts next.config.ts

EXPOSE 3000
CMD ["npm", "start"]
