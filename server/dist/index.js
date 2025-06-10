"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const link_1 = __importDefault(require("./routes/link"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;

// CORS p permitir reqs do front-end
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173', // front-end localhost:5173
    methods: ['GET', 'POST', 'DELETE'], // métodos permitidos
    allowedHeaders: ['Content-Type'], // cabeçalho permitido
}));
app.use(express_1.default.json());
app.use(link_1.default);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
