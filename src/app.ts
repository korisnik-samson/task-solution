import express from 'express';
import dotenv from 'dotenv';
import fileRouter from './routers/fileRoute';

dotenv.config();

const app = express();
app.use('/api/files', fileRouter);

export default app;
