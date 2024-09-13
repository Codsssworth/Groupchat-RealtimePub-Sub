# Use an official Node.js image as the base image
FROM node:18-alpine

# Create and set the working directory inside the container
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force 

COPY . .
COPY ca.pem /usr/src/app/ca.pem
EXPOSE 5000
ENV DATABASE_URL= @uri

CMD ["npm", "run", "dev"]
