import express from 'express';
import { CacheController } from "./controllers/CacheController";
import { DataFetcherController } from "./controllers/DataFetcherController";
import { errorHandler } from './middleware/errorHandler';
import AppRouter from "./routers/apiRouter";
import { logInfo } from "./utils/logger";

const app: express.Express = express();
const PORT = process.env.PORT || 3000;

const dataFetcher = new DataFetcherController(process.env.API_URL || "https://rest-test-eight.vercel.app/api/test");
const cacheService = new CacheController(dataFetcher);

app.use('/api', AppRouter({ cacheService }));
app.use(errorHandler);

app.listen(PORT, () => {
    logInfo(`Server is running on port ${PORT}\n`);
    cacheService.initializeCache();
});