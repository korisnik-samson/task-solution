import express from 'express';
import filesRouter from './api/transformData';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use('/api/files', filesRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});