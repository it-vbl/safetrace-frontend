# Stage 1: Base
FROM node:18.20.3-alpine3.20 AS base

RUN apk add -f --update --no-cache --virtual .gyp nano bash libc6-compat python3 make g++ git \
    && npm install -g next \
    && apk del .gyp 

WORKDIR /app

COPY .git ./
COPY package*.json ./
COPY next-i18next.config.js ./

# Install dependencies in base image
RUN npm install

RUN npm install next-build-id

COPY next.config.js ./

EXPOSE 3000

# Stage 2: Build
FROM base AS builder

RUN apk add git

WORKDIR /app

COPY . .

COPY .git ./

RUN npm run build

# Stage 3: Production
FROM base AS production 
 
WORKDIR /app

# Copy node_modules and .next from builder stage to avoid reinstalling
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Command to run the application
CMD ["npm", "start"]