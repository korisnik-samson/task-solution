import { injectable } from 'tsyringe';
import { IDataService } from './IDataService';
import { ApiResponse } from '../types';
import fs from 'fs';
import path from 'path';

const CACHE_FILE_PATH = path.resolve(__dirname, '../../cache.json');

@injectable()
export class LocalDataService implements IDataService {
    public async fetchData(): Promise<ApiResponse> {
        const data = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    }
}
