import { Router } from 'express';
import { ICacheController, TransformedData } from "../types";
import { logError, logInfo } from "../lib/logger";

const router = Router();

export const AppRouter = ({ cacheService }: ICacheController) =>
    router.get('/files', async (_req, res) => {

    const cachedData: TransformedData = cacheService.getCachedData();

    if (cachedData) {
        logInfo('Serving cached data');
        res.json(cachedData);

        await cacheService.updateCacheInBackground();

    } else {
        logError('Cache unavailable, sending 503');
        res.status(503).json({ error: 'Service unavailable. Please try again later.' });

        await cacheService.updateCache();
    }
});

export default AppRouter;