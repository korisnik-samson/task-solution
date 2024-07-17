import { CacheController } from "../controllers/CacheController";
import { singleton } from "tsyringe";

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