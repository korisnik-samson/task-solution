export const logInfo = (message: string): void => {
    console.log(`[INFO] ${new Date().toISOString()} -- ${message}`);
};

export const logError = (message: string): void => {
    console.error(`[ERROR] ${new Date().toISOString()} -- ${message}`);
};
