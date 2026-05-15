export const logService = (message: string) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};
