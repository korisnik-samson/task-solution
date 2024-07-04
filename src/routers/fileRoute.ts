import { Request, Response, Router } from 'express';
import { getCachedData, updateCache } from '../controllers/fileController';
import cron from 'node-cron';

const router: Router = Router();

router.get('/', async (_req: Request, res: Response) => {
    try {
        const data = await getCachedData();
        res.json(data);

        updateCache(false);

    } catch (error) {
        res.status(503).json({
            error: 'Service unavailable. Please try again later.'
        });
    }
});

cron.schedule('* * * * *', () => updateCache(true));

export default router;
