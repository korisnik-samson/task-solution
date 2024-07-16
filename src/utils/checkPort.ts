import net from 'net';

export const isPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve, _reject) => {

        const server: net.Server = net.createServer()
            .once('error', () => resolve(false))
            .once('listening', () => {
                server.once('close', () => resolve(true)).close()
            })
            .listen(port);

    });
}

// other helper functions can be defined here as well