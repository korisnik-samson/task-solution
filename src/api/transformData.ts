import { Router, Request, Response } from "express";
import axios from "axios";
import { ApiResponse, FileUrl, TransformedData } from "../types";

const router = Router();
const apiUrl = process.env.API_URL || "https://rest-test-eight.vercel.app/api/test";

// Cache variables to store transformed data and timestamp
let cachedData: TransformedData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = Number(process.env.CACHE_DURATION) || 60000; // avoid string type


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
                // Adding file name at the last level
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

router.get('/', async (req: Request, res: Response) => {
    const now = Date.now();

    // Checks data validity
    if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
        return res.json(cachedData);
    }

    try {
        const response = await axios.get<ApiResponse>(apiUrl);
        const transformedData = transformData(response.data);

        // Update cache data
        cachedData = transformedData;

        // Update cache timestamp
        cacheTimestamp = now;
        res.json(transformedData);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
});

export default router;
