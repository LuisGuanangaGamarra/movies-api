FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /app/dist ./dist

RUN chown app:app /app

USER app
COPY --chown=app:app package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 3000

ENTRYPOINT ["node", "dist/main.js"]
