export type DataErrorCode =
  'RATE_LIMITED' | 'UNAVAILABLE' | 'BAD_RESPONSE' | 'TIMEOUT' | 'SERVER_BUSY';

export class DataError extends Error {
  constructor(public readonly code: DataErrorCode) {
    super(code);
    this.name = 'DataError';
  }
}

export async function postFormJson(
  url: string,
  form: Record<string, string>,
  signal: AbortSignal,
  fetcher: typeof fetch = fetch,
): Promise<unknown> {
  let response: Response;

  try {
    response = await fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: new URLSearchParams(form),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new DataError('UNAVAILABLE');
  }

  if (response.status === 429) throw new DataError('RATE_LIMITED');
  if (
    response.status === 502 ||
    response.status === 503 ||
    response.status === 504
  )
    throw new DataError('SERVER_BUSY');
  if (!response.ok) throw new DataError('UNAVAILABLE');

  try {
    return await response.json();
  } catch {
    throw new DataError('BAD_RESPONSE');
  }
}
