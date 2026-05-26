export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  url: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const { json, headers, ...rest } = init ?? {};
  const res = await fetch(url, {
    ...rest,
    headers: {
      ...(json ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : (init?.body as BodyInit | undefined),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({} as { message?: string }));
    throw new ApiError(res.status, data.message ?? res.statusText);
  }
  // 204
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
