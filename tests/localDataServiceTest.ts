import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import { LocalDataService } from '../src/services/LocalDataService';
import { IDataService } from '../src/services/IDataService';
import { ApiResponse } from '../src/types';

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

test('LocalDataService should fetch data from cache.json', async () => {
    const dataService: IDataService = new LocalDataService();
    const data = await dataService.fetchData();
    expect(data).toEqual(mockData);
});
