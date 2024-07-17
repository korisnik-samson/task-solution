import { injectable } from 'tsyringe';
import axios from 'axios';
import { IDataService } from './IDataService';
import { ApiResponse } from '../types';

@injectable()
export class RemoteDataService implements IDataService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = process.env.API_URL || "https://rest-test-eight.vercel.app/api/test";
    }

    public async fetchData(): Promise<ApiResponse> {
        const response = await axios.get<ApiResponse>(this.apiUrl);
        return response.data;
    }
}
