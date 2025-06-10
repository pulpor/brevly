import express from 'express';
import cors from 'cors';
import linkRouter from './routes/link';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(linkRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});