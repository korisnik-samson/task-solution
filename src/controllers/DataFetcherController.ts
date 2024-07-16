import axios from 'axios';
import { ApiResponse } from '../types';

export class DataFetcherController {
    private readonly apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    public async fetchData(): Promise<ApiResponse> {
        const response = await axios.get<ApiResponse>(this.apiUrl);
        return response.data;
    }
}
