export const logger = (message?: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] - ${message || 'Error message is empty'}`);
};
export const serverResult = <T>(data: T, message = 'Successfully fetched data') => {
  logger(message);
  return { data, success: true, message };
};

export function catchError(error: unknown) {
  let status_message = 'An unknown error occurred';
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    status_message = error.message;
    console.error(`[${timestamp}] - ${error}`);
  } else {
    console.error(error);
  }
  return { success: false, message: status_message, data: null };
}
