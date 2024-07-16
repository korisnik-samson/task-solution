import { CacheController } from "../controllers/CacheController";

export interface ApiResponse {
    items: FileUrl[];
}

export interface FileUrl {
    fileUrl: string;
}

export type TransformedData = {
    [key: string]: (string | NestedObject)[];
};

export interface NestedObject {
    [key: string]: string[];
}

export interface ICacheController {
    cacheService: CacheController;
}

export interface IDataService {
    fetchData(): Promise<ApiResponse>;
}