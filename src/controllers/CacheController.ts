import { ApiResponse, TransformedData } from '../types';
import { DataFetcherController } from './DataFetcherController';
import fs from 'fs';
import path from 'path';
import { transformData } from "../utils/transformData";
import { logInfo } from "../utils/logger";

const CACHE_FILE_PATH = path.resolve(__dirname, '../../cache.json');
// const CACHE_DURATION = Number(process.env.CACHE_DURATION) || 60000;

export class CacheController {
    private cachedData: TransformedData | null = null;
    private cacheTimestamp: number = 0;
    private dataFetcher: DataFetcherController;

    constructor(dataFetcher: DataFetcherController) {
        this.dataFetcher = dataFetcher;
    }

    public async initializeCache() {
        if (fs.existsSync(CACHE_FILE_PATH)) {
            const data = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');

            this.cachedData = JSON.parse(data);
            this.cacheTimestamp = Date.now();

            logInfo('Cache initialized from local storage');

        } else {
            await this.updateCache();
        }
    }

    public getCachedData(): TransformedData | null {
        // const now = Date.now();
        // if (this.cachedData && now - this.cacheTimestamp < CACHE_DURATION) return this.cachedData;

        return this.cachedData;
    }

    public async updateCache() {
        try {
            const apiResponse = await this.dataFetcher.fetchData();
            this.cachedData = this.transformData(apiResponse);
            this.cacheTimestamp = Date.now();

            fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(this.cachedData), 'utf-8');
            console.log('Cache created at', new Date(this.cacheTimestamp).toLocaleString());

            logInfo('Cache updated')

        } catch (error) {
            logInfo(`Error updating cache: ${error}`);
        }
    }

    public async updateCacheInBackground() {
        // if (Date.now() - this.cacheTimestamp >= CACHE_DURATION)
        await this.updateCache();
    }

    private transformData(data: ApiResponse): TransformedData {
        return transformData(data);
    }
}
