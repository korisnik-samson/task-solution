import axios from 'axios';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { FileUrl, TransformedData } from '../types';
import { transformData } from '../utils/transformData';

const cacheDir = './cache';
const cacheFilePath = `${cacheDir}/filesData.json`;
const apiUrl = process.env.API_URL || 'https://rest-test-eight.vercel.app/api/test';
const CACHE_DURATION = Number(process.env.CACHE_DURATION) || 60000;

let cacheTimestamp: number = 0;
let cachedData: TransformedData | null = null;

function ensureCacheDir() {
    if (!existsSync(cacheDir)) mkdirSync(cacheDir);
}

function saveToFile(data: TransformedData) {
    ensureCacheDir();
    writeFileSync(cacheFilePath, JSON.stringify(data));
}

function readFromFile(): TransformedData | null {
    if (existsSync(cacheFilePath)) {
        const fileContent = readFileSync(cacheFilePath, 'utf-8');
        return JSON.parse(fileContent) as TransformedData;
    }
    return null;
}

export async function updateCache(isBackground: boolean): Promise<void> {
    try {
        const response = await axios.get(apiUrl);
        const transformedData = transformData(response.data.items as FileUrl[]);
        cachedData = transformedData;
        cacheTimestamp = Date.now();
        saveToFile(transformedData);

        if (!isBackground) {
            console.log('Cache updated at', new Date(cacheTimestamp).toLocaleString());
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function getCachedData(): Promise<TransformedData> {
    if (cachedData) return cachedData;
    else {
        const data = readFromFile();

        if (data) {
            cachedData = data;
            return cachedData;

        } else {
            await updateCache(false);
            return cachedData!;
        }
    }
}

export async function initCache(): Promise<void> {
    const data = readFromFile();
    if (data) {
        cachedData = data;
        cacheTimestamp = Date.now();
        console.log('Cache loaded from file');
    } else {
        await updateCache(false);
    }
}
