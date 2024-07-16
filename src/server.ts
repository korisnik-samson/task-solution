import express from 'express';
import 'reflect-metadata';
import { container } from 'tsyringe';
import { CacheController } from "./controllers/CacheController";
import { DataFetcherController } from "./controllers/DataFetcherController";
import { errorHandler } from './middleware/errorHandler';
import AppRouter from "./routers/apiRouter";
import { logInfo } from "./utils/logger";
import * as process from "node:process";
import { RemoteDataService } from "./services/RemoteDataService";
import { LocalDataService } from "./services/LocalDataService";

container.register('IDataService', {
    useClass: process.env.NODE_ENV === 'production' ? RemoteDataService : LocalDataService,
})

const app: express.Express = express();
const PORT = process.env.PORT || 3001;

const dataFetcher = new DataFetcherController(process.env.API_URL || "https://rest-test-eight.vercel.app/api/test");
const cacheService = new CacheController(dataFetcher);

app.use('/api', AppRouter({ cacheService }));
app.use(errorHandler);

app.listen(PORT, () => {
    logInfo(`Server is running on port ${PORT}\n`);
    cacheService.initializeCache();
});