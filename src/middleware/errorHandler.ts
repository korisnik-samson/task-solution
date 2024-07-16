import { Request, Response, NextFunction } from 'express';
import { logError } from "../utils/logger";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    logError(err);
    res.status(500).json({
        statusCode: 500, description: 'Internal Server Error'
    });
}
