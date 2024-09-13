import { Server } from "socket.io";
import Redis from "ioredis";
import prismaClient from "./prisma";
import { produceMessage } from "./kafka";
import { keys } from "./keys"; 


const { redis_username, redis_password, redis_host, brokers } = keys;

const pub = new Redis({
  host: redis_host,
  port: 17926,
  username: redis_username,
  password: redis_password,
});


const sub = new Redis({
  host: redis_host,
  port: 17926,
  username: redis_username,
  password: redis_password,
});

class SocketService {
  private _io: Server;

  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);

      socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);
      });

     socket.on("event:message", async ({ message, username, room }: { message: string, username: string, room: string }) => {
     console.log("New Message Rec.", message, username, room);
     await pub.publish("MESSAGES", JSON.stringify({ message, username, room }));
     });
    });

    sub.on("message", async (channel, message) => {
      if (channel === "MESSAGES") {
        const { message: text, username } = JSON.parse(message);
        io.emit("message", { text, username });
        await produceMessage(text, username);
        console.log("Message Produced to Kafka Broker");
      }
    });
  }

  get io() {
    return this._io;
  }
}

export default SocketService;
