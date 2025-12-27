const getTimestamp = () => new Date().toISOString();

export const logger = {
    info: (message: any) => console.log(`${getTimestamp()} INFO ${message}`),
    error: (message: any) => console.error(`${getTimestamp()} ERROR ${message}`),
    warn: (message: any) => console.warn(`${getTimestamp()} WARN ${message}`),
    debug: (message: any) => console.log(`${getTimestamp()} DEBUG ${message}`),
}


