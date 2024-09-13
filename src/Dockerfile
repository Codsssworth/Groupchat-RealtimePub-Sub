# Build stage
FROM node:16 as build-stage
WORKDIR /app
COPY /package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]




