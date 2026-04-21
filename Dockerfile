FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm ci --omit=dev
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.js ./drizzle.config.js
EXPOSE 3000
CMD ["npm", "start"]
