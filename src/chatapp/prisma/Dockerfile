# Use an official Prisma image or Node.js (to work with Prisma)
FROM node:18.16.1-slim

# Set the working directory
WORKDIR /usr/src/app
RUN npm install -g prisma
COPY package*.json ./
RUN npm install
COPY schema.prisma ./schema.prisma
COPY ca.pem /usr/src/app/ca.pem
COPY . .


# After installing dependencies
RUN npx prisma generate

RUN ls -l /usr/src/app/node_modules/.prisma/client/
