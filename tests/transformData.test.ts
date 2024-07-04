import { transformData } from '../src/api/transformData';
import { ApiResponse } from '../src/types';

describe('transformData', () => {
    it('should transform data correctly', () => {
        const apiResponse: ApiResponse = {
            items: [
                { fileUrl: 'http://192.168.1.1/folder1/file1.txt' },
                { fileUrl: 'http://192.168.1.1/folder2/file2.txt' },
                { fileUrl: 'http://192.168.1.2/folder3/file3.txt' },
            ]
        };

        const expectedOutput = {
            '192.168.1.1': [
                { folder1: ['file1.txt'] },
                { folder2: ['file2.txt'] },
            ],
            '192.168.1.2': [
                { folder3: ['file3.txt'] },
            ]
        };

        const transformed = transformData(apiResponse);
        expect(transformed).toEqual(expectedOutput);
    });

    it('should handle empty items array', () => {
        const apiResponse: ApiResponse = { items: [] };
        const expectedOutput = {};
        const transformed = transformData(apiResponse);

        expect(transformed).toEqual(expectedOutput);
    });
});
