import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import sweetsRoutes from './routes/sweetsRoutes';
import './db/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Sweet Shop API is running!');
});

export { app, port };

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
