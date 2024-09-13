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
exports.createProducer = createProducer;
exports.produceMessage = produceMessage;
exports.startMessageConsumer = startMessageConsumer;
const kafkajs_1 = require("kafkajs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("./prisma"));
const keys_1 = require("./keys");
const { username, password, brokers } = keys_1.keys;
console.log(username, password);
if (!username || !password) {
    throw new Error('Kafka SASL authentication requires both USERNAME and PASSWORD to be set');
}
const kafka = new kafkajs_1.Kafka({
    brokers: [brokers],
    ssl: {
        ca: [fs_1.default.readFileSync(path_1.default.resolve("./ca.pem"), "utf-8")],
    },
    sasl: {
        username: username,
        password: password,
        mechanism: "plain",
    },
});
let producer = null;
function createProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (producer)
            return producer;
        const _producer = kafka.producer();
        yield _producer.connect();
        producer = _producer;
        return producer;
    });
}
function produceMessage(message, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = yield createProducer();
        yield producer.send({
            messages: [
                { key: `message-${Date.now()}`, value: JSON.stringify({ message, username }) }
            ],
            topic: "MESSAGES",
        });
        return true;
    });
}
function startMessageConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Consumer is running..");
        const consumer = kafka.consumer({ groupId: "default" });
        yield consumer.connect();
        yield consumer.subscribe({ topic: "MESSAGES", fromBeginning: true });
        yield consumer.run({
            autoCommit: true,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ message, pause }) {
                var _b;
                if (!message.value)
                    return;
                console.log(`New Message Recv..`);
                try {
                    yield prisma_1.default.message.create({
                        data: {
                            text: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                        },
                    });
                }
                catch (err) {
                    console.log("Something is wrong");
                    pause();
                    setTimeout(() => {
                        consumer.resume([{ topic: "MESSAGES" }]);
                    }, 60 * 1000);
                }
            }),
        });
    });
}
exports.default = kafka;
