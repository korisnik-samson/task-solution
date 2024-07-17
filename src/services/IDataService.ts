import { ApiResponse } from "../types";

export interface IDataService {
    fetchData(): Promise<ApiResponse>;
}