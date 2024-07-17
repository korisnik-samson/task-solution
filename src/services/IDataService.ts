import { ApiResponse } from "../types";

export interface IDataService {
    // one ghost function to be implemented by the concrete class to basically fetch data
    fetchData(): Promise<ApiResponse>;
}