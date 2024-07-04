import { transformData } from '../src/api/transformData';
import { ApiResponse, TransformedData } from '../src/types';

describe('transformData', () => {
    it('should transform data correctly', () => {
        const apiResponse: ApiResponse = {
            items: [
                { fileUrl: 'http://192.168.0.1/path/to/file1.txt' },
                { fileUrl: 'http://192.168.0.1/path/to/file2.txt' },
                { fileUrl: 'http://192.168.0.2/path/to/file3.txt' },
            ],
        };

        const expectedOutput: TransformedData = {
            '192.168.0.1': [
                { path: ['path', 'to', 'file1.txt'] },
                { path: ['path', 'to', 'file2.txt'] },
            ],
            '192.168.0.2': [{ path: ['path', 'to', 'file3.txt'] }],
        };

        const result = transformData(apiResponse);
        expect(result).toEqual(expectedOutput);
    });
});
