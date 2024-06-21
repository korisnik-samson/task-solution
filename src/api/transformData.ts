import { Request, Response, Router } from "express";
import axios from "axios";
import { ApiResponse, FileUrl, TransformedData } from "../../../task-solution/src/types";
import cron from "node-cron";

const router = Router();
const apiUrl = process.env.API_URL || "https://rest-test-eight.vercel.app/api/test";

let cachedData: TransformedData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = Number(process.env.CACHE_DURATION) || 60000;

export function transformData(data: ApiResponse): TransformedData {
    const transformed: TransformedData = {};

    data.items.forEach((item: FileUrl) => {
        const url = new URL(item.fileUrl);
        const ipAddress = url.hostname;

        // Split the pathname into segments and remove any empty strings
        const pathSegments = url.pathname.split("/").filter(Boolean);

        // Traverse the transformed object and create nested objects as needed
        if (!transformed[ipAddress]) transformed[ipAddress] = [];

        let currentLevel = transformed[ipAddress];

        pathSegments.forEach((segment, i) => {
            if (i === pathSegments.length - 1) {
                // Add file name at the last level
                currentLevel.push(segment);
            } else {
                // Find or create the next level in the nested structure
                let nextLevel = currentLevel.find(level => typeof level === "object" && level.hasOwnProperty(segment));

                if (!nextLevel) {
                    nextLevel = { [segment]: [] };
                    currentLevel.push(nextLevel);
                }

                currentLevel = nextLevel[segment];
            }
        });
    });

    return transformed;
}


// Fetch and transform data from the external API, after which, cache is updated.
async function updateCache() {
    try {
        const response = await axios.get<ApiResponse>(apiUrl);
        cachedData = transformData(response.data);
        cacheTimestamp = Date.now();

        console.log('Cache updated at', new Date(cacheTimestamp).toLocaleString());

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// avoid wait times by initiating the cache - fetch from external API
export async function initCache() {
    await updateCache();
}

// Return the cached data immediately, then trigger a background update if the cache is stale.
router.get('/', (_req: Request, res: Response) => {
    const now = Date.now();

    if (cachedData) {
        res.json(cachedData);

        // Trigger background update if cache is stale
        if (now - cacheTimestamp >= CACHE_DURATION) updateCache();

    } else {
        res.status(503).json({ error: 'Service unavailable. Please try again later.' });

        // Fetch data and update cache immediately
        updateCache();
    }
});

// Schedule a background cron-job to update the cache periodically
cron.schedule('* * * * *', () => updateCache());

export default router;
