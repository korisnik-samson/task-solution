export interface FileUrl {
    fileUrl: string;
}

export interface ApiResponse {
    items: FileUrl[];
}

export interface TransformedData {
    [ipAddress: string]: Array<any>;
}

export interface DirectoryStructure {
    [key: string]: any;
}