export function httpError(
  status: number,
  message: string,
  errors?: Array<{ field: string; message: string }>,
): Error {
  return Object.assign(new Error(message), { status, ...(errors ? { errors } : {}) });
}