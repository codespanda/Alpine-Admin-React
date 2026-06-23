// ============================================================================
// API Client - Typed HTTP Client Abstraction
// ============================================================================

/**
 * Custom error class for API errors.
 * Extends Error with status code and optional response data.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: unknown;

  constructor(status: number, statusText: string, data?: unknown) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }

  /**
   * Whether this error represents an authentication failure.
   */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Whether this error represents a forbidden access attempt.
   */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /**
   * Whether this error represents a not-found resource.
   */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * Whether this error represents a validation error.
   */
  get isValidationError(): boolean {
    return this.status === 422;
  }

  /**
   * Whether this error represents a server error.
   */
  get isServerError(): boolean {
    return this.status >= 500;
  }
}

// ============================================================================
// Interceptor Types
// ============================================================================

type RequestInterceptor = (
  config: RequestInit & { url: string },
) => RequestInit & { url: string };

type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

type ErrorInterceptor = (error: ApiError) => void;

// ============================================================================
// API Client
// ============================================================================

class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // --------------------------------------------------------------------------
  // Interceptor Registration
  // --------------------------------------------------------------------------

  /**
   * Add a request interceptor that runs before each request.
   * Useful for adding auth tokens, logging, etc.
   */
  onRequest(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor that processes each response.
   * Useful for transforming responses, handling token refresh, etc.
   */
  onResponse(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add an error interceptor that runs when a request fails.
   * Useful for global error handling, logging, toast notifications, etc.
   */
  onError(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  // --------------------------------------------------------------------------
  // Public HTTP Methods
  // --------------------------------------------------------------------------

  /**
   * Perform a GET request.
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * Perform a POST request.
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'POST',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Perform a PUT request.
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'PUT',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Perform a PATCH request.
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, {
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Perform a DELETE request.
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.request<T>(url, { method: 'DELETE' });
  }

  // --------------------------------------------------------------------------
  // Internal Helpers
  // --------------------------------------------------------------------------

  /**
   * Build a full URL from an endpoint and optional query parameters.
   */
  private buildUrl(
    endpoint: string,
    params?: Record<string, string>,
  ): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window?.location?.origin ?? 'http://localhost:3000');

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Execute an HTTP request with interceptor pipeline and error handling.
   */
  private async request<T>(
    url: string,
    init: RequestInit,
  ): Promise<T> {
    // Apply default headers
    let config: RequestInit & { url: string } = {
      ...init,
      url,
      headers: {
        ...this.defaultHeaders,
        ...(init.headers as Record<string, string>),
      },
    };

    // Run request interceptors
    for (const interceptor of this.requestInterceptors) {
      config = interceptor(config);
    }

    try {
      let response = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.body,
      });

      // Run response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          // Response body was not JSON
        }

        const error = new ApiError(
          response.status,
          response.statusText,
          errorData,
        );

        // Run error interceptors
        for (const interceptor of this.errorInterceptors) {
          interceptor(error);
        }

        throw error;
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      const apiError = new ApiError(
        0,
        error instanceof Error ? error.message : 'Network Error',
      );

      for (const interceptor of this.errorInterceptors) {
        interceptor(apiError);
      }

      throw apiError;
    }
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || '/api',
);
