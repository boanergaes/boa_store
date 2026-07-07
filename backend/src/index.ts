import express from 'express';
// import path from 'node:path';
import dotenv from 'dotenv';
import { appRouter } from './routes/router.js';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;
const BASE_API = process.env.BASE_URL! as string;

const app = express();

app.use(express.json());

// App router
app.use('/api', appRouter);

app.listen(PORT, (): void => console.log(`Server running on ${BASE_API}.`));