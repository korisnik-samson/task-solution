import axios from 'axios';
import NodeCache from 'node-cache';
import { FileUrl, TransformedData } from '../types';
import { transformData } from '../utils/transformData';

const cache = new NodeCache({ stdTTL: 600 });
const apiUrl = process.env.API_URL || 'https://rest-test-eight.vercel.app/api/test';
const CACHE_DURATION = Number(process.env.CACHE_DURATION) || 60000;

let cacheTimestamp: number = 0;

export async function updateCache(isBackground: boolean): Promise<void> {
    try {
        const response = await axios.get(apiUrl);
        const transformedData = transformData(response.data.items as FileUrl[]);
        cache.set('filesDataStream', transformedData);
        cacheTimestamp = Date.now();

        if (!isBackground) {
            console.log('Cache updated at', new Date(cacheTimestamp).toLocaleString());
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function getCachedData(): Promise<TransformedData> {
    const cachedData = cache.get<TransformedData>('filesDataStream');

    if (cachedData) {
        return cachedData;
    } else {
        await updateCache(false);
        return cache.get<TransformedData>('filesDataStream')!;
    }
}

export async function initCache(): Promise<void> {
    await updateCache(false);
}
