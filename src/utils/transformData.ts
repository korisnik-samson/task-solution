import { ApiResponse, NestedObject, TransformedData } from "../types";

export function transformData(data: ApiResponse): TransformedData {
    const transformed: TransformedData = {};

    data.items.forEach((item) => {
        const url = new URL(item.fileUrl);
        const ipAddress = url.hostname;

        const pathSegments = url.pathname.split('/').filter(Boolean);

        if (!transformed[ipAddress]) transformed[ipAddress] = [];

        let currentLevel: (string | NestedObject)[] = transformed[ipAddress];

        pathSegments.forEach((segment, i) => {
            if (i === pathSegments.length - 1) {
                currentLevel.push(segment);

            } else {
                let nextLevel: NestedObject | string | any = currentLevel.find(
                    level => typeof level === 'object' && level.hasOwnProperty(segment)
                );

                if (!nextLevel) {
                    nextLevel = { [segment]: [] };
                    currentLevel.push(nextLevel);
                }

                currentLevel = nextLevel[segment];
            }
        });
    });

    return transformed;
}