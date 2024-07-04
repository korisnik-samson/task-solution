import { FileUrl, DirectoryStructure } from '../types';

export function transformData(urlObjects: FileUrl[]): DirectoryStructure {
    const result: DirectoryStructure = {};

    urlObjects.forEach((urlObject) => {
        const url = urlObject.fileUrl;
        const parts = url.split('/');
        const ip = parts[2].split(':')[0];
        const directories = parts.slice(3, -1);
        const fileName = parts.pop()!;

        if (!result[ip]) result[ip] = [];
        let currentLevel = result[ip];

        directories.forEach((dir) => {
            // had issues with deprecation of hasOwnProperty
            let nextLevel = currentLevel.find((d: any) => d.hasOwnProperty(dir));

            if (!nextLevel) {
                nextLevel = { [dir]: [] };
                currentLevel.push(nextLevel);
            }

            currentLevel = nextLevel[dir];
        });

        if (Array.isArray(currentLevel)) currentLevel.push(fileName);
    });

    return result;
}
