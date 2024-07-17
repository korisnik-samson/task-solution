import fs from "fs";
import path from "path";

const CACHE_FILE_PATH = path.resolve(__dirname, '../../cache.json');

export function isCachePresent(): boolean {
    return fs.existsSync(CACHE_FILE_PATH);
}