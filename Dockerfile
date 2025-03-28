# Gunakan image Node.js yang ringan
FROM node:18.20.5-alpine3.20 AS base


# Install dependencies
RUN apk add --no-cache nano bash libc6-compat python3 make g++ git

WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu
COPY package.json package-lock.json ./

# Install dependencies termasuk devDependencies
RUN npm ci

# Copy seluruh proyek
COPY . .

# Pastikan autoprefixer tersedia
RUN npm install autoprefixer postcss --save-dev

RUN npx eslint --fix . || true

# Build aplikasi Next.js
RUN npm run build

# Gunakan image production yang lebih ringan
FROM node:18-alpine AS runner
WORKDIR /app

# Salin hasil build dari tahap builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/public public
COPY --from=builder /app/next.config.js next.config.js

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
