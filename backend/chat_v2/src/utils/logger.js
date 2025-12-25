function logger() {
  const timestamp = new Date().toISOString();
  return {
    info: (message) => console.log(`${timestamp} INFO ${message}`),
    error: (message) => console.error(`${timestamp} ERROR ${message}`),
    warn: (message) => console.warn(`${timestamp} WARN ${message}`),
    debug: (message) => console.log(`${timestamp} DEBUG ${message}`),
  };
}

export { logger: logger() };
