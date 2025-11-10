/**
 * Axios HTTP client configuration
 */

import axios, { AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '@/types';
import { API_CONFIG } from '@/utils/constants';

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  getToken: () => string | null;
  onUnauthorized?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Create configured Axios instance
 */
export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
  });

  // Request interceptor: Add auth token
  instance.interceptors.request.use(
    (reqConfig: InternalAxiosRequestConfig) => {
      const token = config.getToken();
      if (token && reqConfig.headers) {
        reqConfig.headers.Authorization = `Bearer ${token}`;
      }
      return reqConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: Handle errors
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        config.onUnauthorized?.();
      }

      // Transform API error to application error
      if (error.response?.data?.error) {
        const apiError = new Error(error.response.data.error.message);
        (apiError as Error & { code?: string; details?: unknown }).code =
          error.response.data.error.code;
        (apiError as Error & { code?: string; details?: unknown }).details =
          error.response.data.error.details;

        config.onError?.(apiError);
        return Promise.reject(apiError);
      }

      // Network or other errors
      config.onError?.(error);
      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Get API base URL from environment
 */
export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || 'https://localhost:44347';
}

/**
 * Default API client instance
 */
let apiClientInstance: AxiosInstance | null = null;

export function getApiClient(): AxiosInstance {
  if (!apiClientInstance) {
    apiClientInstance = createApiClient({
      baseURL: getApiBaseUrl(),
      getToken: () => localStorage.getItem('auth_token'),
      onUnauthorized: () => {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      },
      onError: (error) => {
        console.error('API Error:', error);
      },
    });
  }
  return apiClientInstance;
}
