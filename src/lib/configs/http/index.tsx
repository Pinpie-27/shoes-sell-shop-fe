/* eslint-disable no-param-reassign */
import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

import { ACCESS_TOKEN, API_TIMEOUT, BASE_API_URL } from '@/constants';

export interface RequestParams {
    url: string;
    options?: AxiosRequestConfig;
    data?: Record<string, any> | FormData;
}

export type Meta = {
    total: number;
    page: number;
    limit: number;
};

export type ServerResponse<T = any> =
    | ServerResponseFail
    | ServerResponseSuccess<T>
    | ServerResponsePagination<T>;

export type ServerResponseFail = {
    status: 'fail';
    data: {
        message?: string;
        error?: string;
    };
};

export type ServerResponseSuccess<T = any> = {
    status: 'success';
    data: T;
};

export type ServerResponsePagination<T = any> = {
    status: 'success';
    data: {
        meta: Meta;
        data: T;
    };
};

export class HTTPService {
    private apiInstance: AxiosInstance;

    constructor() {
        this.apiInstance = axios.create({
            baseURL: BASE_API_URL,
            timeout: API_TIMEOUT,
        });

        this.apiInstance.interceptors.request.use(async (config: AxiosRequestConfig) => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (token && config?.headers) {
                config.headers = {
                    ...config.headers,
                    Authorization: `Bearer ${token}`,
                };
                if (!config.headers['Content-Type']) {
                    config.headers['Content-Type'] = 'application/json';
                }
            }
            return config as InternalAxiosRequestConfig<any>;
        });

        this.apiInstance.interceptors.response.use(
            (res: AxiosResponse<ServerResponse>) => {
                // throw error on server error
                if (res.data.status === 'fail') {
                    throw new Error(res.data?.data.message || res.data?.data.error);
                }
                return res;
            },
            (error) => {
                throw error;
            }
        );
    }

    public async get<T = any>(params: RequestParams): Promise<T> {
        const res = await this.apiInstance.get<T>(params.url, {
            ...params.options,
            params: params.data,
        });
        return res.data;
    }

    public async post<T = any>(params: RequestParams): Promise<T> {
        const res = await this.apiInstance.post<T>(params.url, params.data, params.options);
        return res.data;
    }

    public async put<T = any>(params: RequestParams): Promise<T> {
        const res = await this.apiInstance.put<T>(params.url, params.data, params.options);
        return res.data;
    }

    public async patch<T = any>(params: RequestParams): Promise<T> {
        const res = await this.apiInstance.patch<T>(params.url, params.data, params.options);
        return res.data;
    }

    public async del<T = any>(params: RequestParams): Promise<T> {
        const res = await this.apiInstance.delete<T>(params.url, {
            data: params.data,
            ...params.options,
        });
        return res.data;
    }
}
