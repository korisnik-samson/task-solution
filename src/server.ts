import express from 'express';
import dotenv from 'dotenv';
import { initCache } from './controllers/fileController';
import fileRouter from './routers/fileRoute';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

initCache().then(() => {
    console.log('Cache initialized');
    app.use('/api/files', fileRouter);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch(error => {
    console.error('Failed to initialize cache', error.message);
});
