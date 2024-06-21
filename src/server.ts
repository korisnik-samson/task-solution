import express from 'express';
import router from './api/transformData';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use('/api/files', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});