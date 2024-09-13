# Build stage
FROM node:18 AS build
WORKDIR /app
COPY /package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000 
CMD ["npm", "run", "start"]






