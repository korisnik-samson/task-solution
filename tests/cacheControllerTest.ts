import 'reflect-metadata';
import { container } from 'tsyringe';
import { CacheController } from '../src/controllers/CacheController';
import { IDataService } from '../src/services/IDataService';
import { LocalDataService } from '../src/services/LocalDataService';
import fs from 'fs';
import path from 'path';
import { ApiResponse, TransformedData } from '../src/types';

const CACHE_FILE_PATH = path.resolve(__dirname, '../cache.json');

const mockData: ApiResponse = {
    items: [
        { fileUrl: 'http://localhost/file1' },
        { fileUrl: 'http://localhost/file2' },
    ],
};

beforeAll(() => {
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(mockData), 'utf-8');
});

afterAll(() => {
    if (fs.existsSync(CACHE_FILE_PATH)) {
        fs.unlinkSync(CACHE_FILE_PATH);
    }
});

test('CacheController should initialize cache from cache.json', async () => {
    container.register<IDataService>('IDataService', { useClass: LocalDataService });
    const cacheController = container.resolve(CacheController);
    await cacheController.initializeCache();
    const cachedData = cacheController.getCachedData();
    expect(cachedData).not.toBeNull();
});

test('CacheController should update cache correctly', async () => {
    container.register<IDataService>('IDataService', { useClass: LocalDataService });
    const cacheController = container.resolve(CacheController);
    await cacheController.updateCache();
    const cachedData = cacheController.getCachedData();
    expect(cachedData).not.toBeNull();
});

test('CacheController should serve valid cached
