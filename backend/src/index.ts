import express, {type Request, type Response} from 'express';
// import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 3000;

const app = express();

app.get('/', (req: Request, res: Response): void => {
    console.log(req.body);
    res.send('Hello World.');
})

app.listen(PORT, (): void => console.log(`Server running on port ${PORT}.`));