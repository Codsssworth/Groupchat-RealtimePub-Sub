# Use an official Node.js image as the base image
FROM node:18-alpine

WORKDIR /usr/src/app
COPY . .
COPY package*.json ./
RUN npm install
COPY ca.pem /usr/src/app/ca.pem

RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "dev"]