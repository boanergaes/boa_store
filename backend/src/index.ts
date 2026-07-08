import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { appRouter } from './routes/router.js';
import { db } from './models/db.js';


const PORT: number = Number(process.env.PORT) || 3000;
const BASE_API = process.env.BASE_URL! as string;

const app = express();

app.use(express.json());

// App router
app.use('/api', appRouter);

app.listen(PORT, async (): Promise<void> => {
    console.log(`Server running on ${BASE_API}.`);

    try {
        await db.query('SELECT NOW();');
        console.log('Connected to PostgreSQL.');
    } catch(err) {
        console.log('Failed to Connect to PostgreSQL!');
        console.error(err);
    }
});