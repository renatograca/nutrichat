const timestamp = new Date().toISOString();

export const logger = {
    info: (message: any) => console.log(`${timestamp} INFO ${message}`),
    error: (message: any) => console.error(`${timestamp} ERROR ${message}`),
    warn: (message: any) => console.warn(`${timestamp} WARN ${message}`),
    debug: (message: any) => console.log(`${timestamp} DEBUG ${message}`),
}


