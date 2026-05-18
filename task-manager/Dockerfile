# 1단계: 프론트엔드 빌드
FROM node:20-alpine AS builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# 2단계: 서버 실행
FROM node:20-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./
COPY --from=builder /app/client/dist ../client/dist

EXPOSE 8080
CMD ["node", "index.js"]
