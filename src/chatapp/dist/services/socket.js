"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const kafka_1 = require("./kafka");
const keys_1 = require("./keys");
const { redis_username, redis_password, redis_host, brokers } = keys_1.keys;
const pub = new ioredis_1.default({
    host: redis_host,
    port: 17926,
    username: redis_username,
    password: redis_password,
});
const sub = new ioredis_1.default({
    host: redis_host,
    port: 17926,
    username: redis_username,
    password: redis_password,
});
class SocketService {
    constructor() {
        console.log("Init Socket Service...");
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: ["*"],
                origin: "*",
            },
        });
        sub.subscribe("MESSAGES");
    }
    initListeners() {
        const io = this.io;
        console.log("Init Socket Listeners...");
        io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id);
            socket.on("joinRoom", (room) => {
                socket.join(room);
                console.log(`User ${socket.id} joined room ${room}`);
            });
            socket.on("event:message", (_a) => __awaiter(this, [_a], void 0, function* ({ message, username, room }) {
                console.log("New Message Rec.", message, username, room);
                yield pub.publish("MESSAGES", JSON.stringify({ message, username, room }));
            }));
        });
        sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            if (channel === "MESSAGES") {
                const { message: text, username } = JSON.parse(message);
                io.emit("message", { text, username });
                yield (0, kafka_1.produceMessage)(text, username);
                console.log("Message Produced to Kafka Broker");
            }
        }));
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
