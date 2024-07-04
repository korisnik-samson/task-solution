import { updateCache } from '../controllers/fileController';

export async function initCache(): Promise<void> {
    await updateCache(false);
}
