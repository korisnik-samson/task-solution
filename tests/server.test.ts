// __tests__/app.test.ts

import request from 'supertest';
import { app } from '../src/server'; // Adjust the path as needed
import * as transformData from '../src/api/transformData';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the initCache function
jest.spyOn(transformData, 'initCache').mockImplementation(async() => {
    const mockData = { key: 'value' };
    transformData. = mockData;
    transformData.cacheTimestamp = Date.now();
});

// Initialize the app before running tests
beforeAll(async() => {
    await transformData.initCache();
});

describe('GET /api/files', () => {
    beforeEach(() => {
        transformData.cachedData = null;
        transformData.cacheTimestamp = 0;
    });

    it('should return data when cache is initialized', async() => {
        const mockData = { key: 'value' };
        transformData.cachedData = mockData;
        transformData.cacheTimestamp = Date.now();

        const response = await request(app).get('/api/files');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockData);
    });

    it('should return an error if cache is not initialized', async() => {
        const response = await request(app).get('/api/files');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({
            error: 'Service unavailable. Please try again later.'
        });
    });

    it('should fetch data from external API and set cache', async() => {
        const mockData = { key: 'value' };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        await transformData.initCache();
        const cachedData = transformData.cachedData;
        expect(cachedData).toEqual(mockData);
    });
});
