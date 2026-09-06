import type { Paginated, ProblemDetails } from "@hospital/shared-types";

export interface ApiClientOptions {
    baseUrl: string;
    getToken?: () => string | null;
}

export class ApiError extends Error {
    problem: ProblemDetails;
    constructor(problem: ProblemDetails) {
        super(problem.detail ?? problem.title);
        this.problem = problem;
    }
}

export function createApiClient(options: ApiClientOptions) {
    async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
        const token = options.getToken?.();
        const res = await fetch(`${options.baseUrl}${path}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(init.headers ?? {}),
            },
        }); 
        if (!res.ok) {
            const problem: ProblemDetails = (await res.json().catch(() => ({
                type: "about:blank",
                title: res.statusText,
                status: res.status,
            }))) as ProblemDetails;
            throw new ApiError(problem);
        }
        if (res.status === 204) return undefined as unknown as T; // No Content
        return res.json() as Promise<T>;
    }

    return {
        get: <T>(path: string) => request<T>(path),
        post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
        put: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
        patch: <T>(path: string, body: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
        del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),

        // ví dụ gom nhóm theo resource, thêm dần khi làm từng service:
        auth: {
        login: (body: { email: string; password: string }) =>
            request<{ accessToken: string; refreshToken: string }>('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify(body),
            }),
        register: (body: { email: string; password: string; fullName: string; phone: string }) =>
            request<{ id: string }>('/api/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify(body),
            }),
        },
        patients: {
        list: (page = 1, limit = 20) =>
            request<Paginated<unknown>>(`/api/v1/patients?page=${page}&limit=${limit}`),
        },
    };
}

export type ApiClient = ReturnType<typeof createApiClient>;