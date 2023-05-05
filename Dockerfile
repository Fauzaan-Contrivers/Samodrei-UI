FROM node:16-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --force

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
CMD [ "npm","run","dev" ]
