import express from 'express';
import router, { initCache } from './api/transformData';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

initCache().then(() => {
    console.log('Cache initialized\n');
    app.use('/api/files', router);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}\n`);
    });

    // if any errors with cache initialization
}).catch(error => {
    console.error('Failed to initialize cache', error.message);
});