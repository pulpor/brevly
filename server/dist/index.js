"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const link_1 = require("./routes/link");
dotenv_1.default.config();
const app = (0, fastify_1.default)({ logger: true });
app.register(cors_1.default, {
    origin: process.env.VITE_FRONTEND_URL,
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
});
app.register(link_1.registerLink, { prefix: '/link' });
const PORT = parseInt(process.env.PORT ?? '3000', 10);
app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    console.log(`Servidor rodando na porta ${PORT}`);
});
