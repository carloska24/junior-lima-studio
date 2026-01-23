# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Placeholder for prisma generate validation (real URL comes from Cloud Run at runtime)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src

RUN npm install
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:22-alpine

WORKDIR /app

# Placeholder for prisma generate validation (real URL comes from Cloud Run at runtime)
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=production
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["npm", "start"]
