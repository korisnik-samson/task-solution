import { promises as fs } from 'fs';
import { join } from 'path';
import axios from 'axios';
import { updateCache, getCachedData } from '../src/controllers/fileController';
import { initCache } from '../src/controllers/fileController';
import { FileUrl, TransformedData } from '../src/types';

jest.mock('axios');
const mockedAxios: jest.Mocked<axios.AxiosStatic> = axios as jest.Mocked<typeof axios>;

const cacheDir = './cache';
const cacheFilePath = join(cacheDir, 'filesData.json');

const sampleApiData: { items: FileUrl[] } = {
    items: [
        { fileUrl: 'http://127.0.0.1:8000/dir1/dir2/file1.txt' },
        { fileUrl: 'http://127.0.0.1:8000/dir1/file2.txt' }
    ]
};

const transformedData: TransformedData = {
    '127.0.0.1': [
        {
            dir1: [
                {
                    dir2: ['file1.txt']
                },
                'file2.txt'
            ]
        }
    ]
};

describe('fileController', () => {
    beforeEach(async () => {
        jest.clearAllMocks();

        if (await fs.stat(cacheFilePath).then(() => true).catch(() => false))
            await fs.unlink(cacheFilePath);

        if (await fs.stat(cacheDir).then(() => true).catch(() => false))
            await fs.rmdir(cacheDir, { recursive: true });
    });

    test('initCache creates cache directory and loads cache from file if available', async() => {
        await fs.mkdir(cacheDir, { recursive: true });
        await fs.writeFile(cacheFilePath, JSON.stringify(transformedData));

        await initCache();
        const data = await getCachedData();

        expect(data).toEqual(transformedData);
    });

    test('initCache updates cache if file is not available', async() => {
        mockedAxios.get.mockResolvedValue({ data: sampleApiData })

        await initCache();
        const data = await getCachedData();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(data).toEqual(transformedData);
    });

    test('updateCache fetches data from API and updates cache', async() => {
        mockedAxios.get.mockResolvedValue({ data: sampleApiData })
        await updateCache(false);
        const data = await getCachedData();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(data).toEqual(transformedData);
    });

    test('getCachedData returns cached data if available', async() => {
        mockedAxios.get.mockResolvedValue({ data: sampleApiData });

        await updateCache(false);
        const data = await getCachedData();

        expect(data).toEqual(transformedData);
    });

    test('getCachedData updates cache if data is not available', async() => {
        mockedAxios.get.mockResolvedValue({ data: sampleApiData });

        await updateCache(false);
        await fs.unlink(cacheFilePath);

        const data = await getCachedData();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1); // Once in updateCache and once in getCachedData
        expect(data).toEqual(transformedData);
    });
});
