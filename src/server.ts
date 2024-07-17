import express from 'express';
import 'reflect-metadata';
import { container, Lifecycle } from 'tsyringe';
import { CacheController } from "./controllers/CacheController";
import { errorHandler } from './middleware/errorHandler';
import AppRouter from "./routers/apiRouter";
import { logInfo } from "./lib/logger";
import * as process from "node:process";
import { RemoteDataService } from "./services/RemoteDataService";
import { LocalDataService } from "./services/LocalDataService";
import { isCachePresent } from "./lib/utils";

container.register('IDataService',
    // the purpose is to start with LocalService and then switch to RemoteService if cache is present

    /*{ useClass: process.env.NODE_ENV! === 'production' ? RemoteDataService : LocalDataService, },*/
    /*{ useClass: isCachePresent() ? RemoteDataService : LocalDataService, },*/

    { useClass: RemoteDataService, },
    { lifecycle: Lifecycle.Singleton, }
)

const app: express.Express = express();
const PORT = process.env.PORT || 3001;

const cacheService = container.resolve(CacheController);

app.use('/api', AppRouter({ cacheService }));
app.use(errorHandler);

app.listen(PORT, () => {
    logInfo(`Server is running on port ${PORT}\n`);
    cacheService.initializeCache();
});