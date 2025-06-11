import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { registerLink } from './routes/link';

dotenv.config();

const app = fastify({ logger: true });

app.register(cors, {
  origin: process.env.VITE_FRONTEND_URL,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
});

app.register(registerLink, { prefix: '/link' });

const PORT = parseInt(process.env.PORT ?? '3000', 10);

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor rodando na porta ${PORT}`);
});