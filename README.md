demonstraintion project employing redis pub-sub and kafka distributed event processing with socket.io  configured to listen on websocket for messages and prisma orm for generating message schemas

### configured to aiven cloud postgreDB to store user profile ,redis.io for message broker

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000]

### \server `npm run dev`

Runs the server in the development mode.\
Open [http://localhost:5000]

### \src\chatapp `npm run dev`

Runs the server in the development mode.\
Open [http://localhost:5000]

### \src\chatapp\prisma `npx prisma generate`

generates prisma schema from schema.prisma

### build and runs the container
docker-compose up --build


