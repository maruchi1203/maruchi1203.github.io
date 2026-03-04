FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY src/backend/package.json src/backend/package.json
COPY src/frontend/package.json src/frontend/package.json
RUN npm install --workspaces --include-workspace-root

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build -w src/frontend && npm run build -w src/backend

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/src/backend/dist ./src/backend/dist
COPY --from=build /app/src/backend/package.json ./src/backend/package.json
COPY --from=build /app/src/frontend/out ./src/frontend/out
COPY --from=build /app/src/frontend/public ./src/frontend/public
COPY --from=build /app/src/frontend/scripts ./src/frontend/scripts
COPY --from=build /app/src/frontend/package.json ./src/frontend/package.json
EXPOSE 4000
EXPOSE 3000
CMD ["npm", "run", "start"]
