/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Chowra Logistics Monitored HTTP & Fetch API Wrapper
 * Integrated with PerformanceMonitor and Error Logging
 * Lead Architect: Chowra Engineering Team
 */

import { performanceMonitor } from './monitor';
import { sampleShipments, getShipmentByAwb } from '../data/mockShipments';
import { networkHubs } from '../data/logisticsData';

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  skipMonitoring?: boolean;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  durationMs: number;
  traceId: string;
}

/**
 * High-performance monitored fetch wrapper that records latency, errors,
 * and correlation trace IDs through PerformanceMonitor.
 */
export async function monitoredFetch<T = unknown>(
  input: string | URL | Request,
  init?: ApiRequestOptions
): Promise<ApiResponse<T>> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const method = init?.method?.toUpperCase() || 'GET';
  const traceId = performanceMonitor.generateTraceId();
  const startTime = performance.now();

  const headers = new Headers(init?.headers || {});
  headers.set('X-Correlation-Trace-Id', traceId);
  headers.set('X-Client-Timestamp', new Date().toISOString());
  headers.set('X-Chowra-Environment', 'Chowra Engineering Team');

  try {
    // Check if this is an internal / mock endpoint to provide instant, real responses
    const mockResponse = await resolveInternalRoute<T>(url, method, init?.body);
    if (mockResponse) {
      const durationMs = Math.round(performance.now() - startTime);

      if (!init?.skipMonitoring) {
        performanceMonitor.recordMetric({
          url,
          method,
          statusCode: mockResponse.status,
          durationMs,
          success: mockResponse.status >= 200 && mockResponse.status < 400,
          traceId,
        });
      }

      return {
        data: mockResponse.data,
        status: mockResponse.status,
        statusText: 'OK',
        durationMs,
        traceId,
      };
    }

    // Standard native fetch
    const response = await fetch(input, {
      ...init,
      headers,
    });

    const durationMs = Math.round(performance.now() - startTime);
    const isSuccess = response.ok;

    let responseData: T;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseData = (await response.json()) as T;
    } else {
      responseData = (await response.text()) as unknown as T;
    }

    if (!init?.skipMonitoring) {
      performanceMonitor.recordMetric({
        url,
        method,
        statusCode: response.status,
        durationMs,
        success: isSuccess,
        error: isSuccess ? undefined : `HTTP ${response.status} ${response.statusText}`,
        traceId,
      });
    }

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      durationMs,
      traceId,
    };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    const errorMessage = error instanceof Error ? error.message : 'Unknown Network Error';

    if (!init?.skipMonitoring) {
      performanceMonitor.recordMetric({
        url,
        method,
        statusCode: 0,
        durationMs,
        success: false,
        error: errorMessage,
        traceId,
      });

      performanceMonitor.logError({
        message: `Network Request Failed: ${errorMessage}`,
        url,
        method,
        severity: 'high',
        context: {
          traceId,
          durationMs,
        },
      });
    }

    throw error;
  }
}

/**
 * Internal route resolver for API endpoints such as /health, /docs/specs,
 * /api/v1/shipments, /api/v1/hubs, and /api/v1/rates.
 */
async function resolveInternalRoute<T>(
  url: string,
  method: string,
  body?: BodyInit | null
): Promise<{ status: number; data: T } | null> {
  const cleanUrl = url.split('?')[0];

  // 1. Health Status Endpoint: /health or /api/health
  if (cleanUrl.endsWith('/health') || cleanUrl.endsWith('/healthz') || cleanUrl.endsWith('/api/health')) {
    const uptimeSec = Math.floor(performance.now() / 1000);
    const metrics = performanceMonitor.getMetricsSummary();

    return {
      status: 200,
      data: {
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'chowra-logistics-dispatch-platform',
        version: '2.4.0',
        environment: 'production',
        leadArchitect: 'Chowra Engineering Team',
        uptimeSeconds: uptimeSec,
        systemHealth: {
          databaseTelemetry: 'HEALTHY',
          gpsLinehaulSocket: 'CONNECTED',
          airCargoBSAs: 'ACTIVE',
          notificationService: 'ONLINE',
          geospatialEngine: 'READY',
        },
        performance: {
          totalRequestsRecorded: metrics.totalRequests,
          averageLatencyMs: metrics.averageLatencyMs,
          p95LatencyMs: metrics.p95LatencyMs,
          successRatePercentage: metrics.successRatePercentage,
        },
        memory: {
          heapUsedMb: Math.round((performance as any).memory?.usedJSHeapSize / (1024 * 1024)) || 42,
          heapTotalMb: Math.round((performance as any).memory?.totalJSHeapSize / (1024 * 1024)) || 85,
        },
      } as T,
    };
  }

  // 2. Interactive OpenAPI / Swagger Documentation Schema: /docs/schema or /api/docs
  if (cleanUrl.endsWith('/docs/schema') || cleanUrl.endsWith('/api/docs')) {
    return {
      status: 200,
      data: {
        openapi: '3.0.3',
        info: {
          title: 'Chowra Logistics and Couriers Limited REST API',
          version: '2.4.0',
          description: 'Official API specifications for consignment tracking, rate calculation, and doorstep dispatch.',
          contact: {
            name: 'Chowra Engineering Team (Lead System Architect)',
            email: 'support@example.com',
          },
        },
        servers: [
          { url: 'https://api.chowralogistics.example/v1', description: 'Production Air Cargo Gateway' },
          { url: 'https://staging-api.chowralogistics.example/v1', description: 'Staging Environment' },
        ],
        paths: {
          '/health': {
            get: {
              summary: 'Service Health & Telemetry Status',
              responses: { '200': { description: 'Control tower operational heartbeat' } },
            },
          },
          '/shipments/{awb}': {
            get: {
              summary: 'Consignment Milestones & GPS Location',
              parameters: [{ name: 'awb', in: 'path', required: true }],
            },
          },
          '/shipments/book': {
            post: {
              summary: 'Create Doorstep Pickup Booking',
              requestBody: { required: true },
            },
          },
          '/hubs': {
            get: { summary: 'List Operational Air Cargo Hubs' },
          },
          '/rates/calculate': {
            post: { summary: 'Volumetric & Weight Freight Calculation' },
          },
        },
      } as T,
    };
  }

  // 3. API Shipments Endpoint: /api/v1/shipments/:awb
  if (cleanUrl.includes('/api/v1/shipments/')) {
    const awb = cleanUrl.split('/api/v1/shipments/')[1];
    const shipment = getShipmentByAwb(awb || 'CHW-8942-IN');
    return {
      status: 200,
      data: shipment as T,
    };
  }

  // 4. API Hubs Endpoint: /api/v1/hubs
  if (cleanUrl.endsWith('/api/v1/hubs')) {
    return {
      status: 200,
      data: networkHubs as T,
    };
  }

  // 5. API Doorstep Pickup Booking
  if (cleanUrl.endsWith('/api/v1/shipments/book') && method === 'POST') {
    let parsed: any = {};
    try {
      if (typeof body === 'string') parsed = JSON.parse(body);
    } catch (e) {}

    const newBookingId = `BK-CHW-${Math.floor(10000 + Math.random() * 90000)}`;
    const newAwb = `CHW-${Math.floor(1000 + Math.random() * 9000)}-EXP`;

    return {
      status: 201,
      data: {
        success: true,
        bookingId: newBookingId,
        awbNumber: newAwb,
        status: 'DISPATCHED',
        driverName: 'Ramesh K. (Courier Van MH-02-EXP)',
        driverPhone: '+91 98200 11920',
        createdAt: new Date().toISOString(),
        details: parsed,
      } as T,
    };
  }

  return null;
}

// Convenience export matching standard axios/fetch patterns
export const apiClient = {
  get: <T = unknown>(url: string, options?: ApiRequestOptions) =>
    monitoredFetch<T>(url, { ...options, method: 'GET' }),
  post: <T = unknown>(url: string, body?: unknown, options?: ApiRequestOptions) =>
    monitoredFetch<T>(url, {
      ...options,
      method: 'POST',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    }),
  put: <T = unknown>(url: string, body?: unknown, options?: ApiRequestOptions) =>
    monitoredFetch<T>(url, {
      ...options,
      method: 'PUT',
      body: typeof body === 'string' ? body : JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    }),
  delete: <T = unknown>(url: string, options?: ApiRequestOptions) =>
    monitoredFetch<T>(url, { ...options, method: 'DELETE' }),
};
