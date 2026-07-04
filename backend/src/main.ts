import express, {type Request, type Response} from 'express';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World.');
})

app.listen(3000, () => console.log(`Server running on port 3000.`));