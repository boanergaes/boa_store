type HttpMethod =  "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const Method = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
} as const;

export type ApiResponse<T> = T & { resStatus: number };

class ApiService {
    readonly base_url: string;
    readonly accept: string;
    readonly content_type: string;

    constructor (base_url: string, accept: string = "application/json", content_type: string = "application/json") {
        this.base_url = base_url;
        this.accept = accept;
        this.content_type = content_type;
    }

    async fetchApi<T>(method: HttpMethod, url: string, option?: RequestInit): Promise<ApiResponse<T>> {
        try {
            const full_url: string = this.base_url + url;

            const result = await fetch(full_url, {
                ...option,
                method: method,
                headers: {
                    "Content-Type": this.content_type,
                    "Accept": this.accept,
                    ...option?.headers
                }
            });

            const text = await result.text();
            // handle empty responses
            const data: T = text ? JSON.parse(text) : (null as T);
            
            if (!result.ok) {
                throw {
                    status: result.status,
                    ...(data as object)
                }
            }

            return {
                resStatus: result.status,
                ...data
            };
        } catch(err) {
            console.error(`Error: could not fetch ${method.toUpperCase()} ${this.base_url + url}`, err); // @TODO: remove err from this if it appears twice in the console.
            throw err;
        }
    }

    get<T>(url: string, option?: RequestInit): Promise<ApiResponse<T>> {
        return this.fetchApi<T>(Method.GET, url, option);
    }

    post<T>(url: string, option: RequestInit): Promise<ApiResponse<T>> {
        return this.fetchApi<T>(Method.POST, url, option);
    }

    put<T>(url: string, option: RequestInit): Promise<ApiResponse<T>> {
        return this.fetchApi<T>(Method.PUT, url, option);
    }

    patch<T>(url: string, option: RequestInit): Promise<ApiResponse<T>> {
        return this.fetchApi<T>(Method.PATCH, url, option);
    }

    delete<T>(url: string, option?: RequestInit): Promise<ApiResponse<T>> {
        return this.fetchApi<T>(Method.DELETE, url, option);
    }
}

export const api = new ApiService(import.meta.env.VITE_BASE_API);