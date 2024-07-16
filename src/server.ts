import express, { Express } from 'express';
import dotenv from 'dotenv';
import { initCache } from './controllers/fileController';
import fileRouter from './routers/fileRoute';
import { isPortAvailable } from "./utils/checkPort";
import * as process from "node:process";

dotenv.config();

const app: Express = express();
const PORT = Number(process.env.PORT || 3000);
const MAX_PORT = PORT + 10;

const startServer = async (port: number) => {
    let availablePort = port;

    while (!(await isPortAvailable(availablePort)) && availablePort <= MAX_PORT)
        availablePort++;

    if (availablePort > MAX_PORT) {
        console.error('No available port found');
        process.exit(1);
    }

    initCache().then(() => {
        console.log('\nCache initialized');
        app.use('/api/files', fileRouter);

        app.listen(availablePort, () => {
            console.log(`\nServer running on port ${availablePort}`);
        });

    }).catch(error => {
        console.error('Failed to initialize cache', error.message);
    });
}

startServer(PORT);


