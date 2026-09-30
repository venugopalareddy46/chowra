/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Chowra Logistics Real-Time Performance Monitor & Error Logger
 * Core Architecture & Engineering: Chowra Engineering Team
 * Ref: MON-VGRE-2026-PROD
 */

export interface PerformanceMetric {
  id: string;
  url: string;
  method: string;
  statusCode?: number;
  durationMs: number;
  timestamp: number;
  success: boolean;
  error?: string;
  traceId: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  context?: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface MetricsSummary {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  successRatePercentage: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  activeErrorsCount: number;
  uptimeSeconds: number;
  leadArchitect: string;
}

class PerformanceMonitorService {
  private metrics: PerformanceMetric[] = [];
  private errorLogs: ErrorLog[] = [];
  private readonly maxBufferSize = 250;
  private readonly startTime = Date.now();
  private subscribers: Array<(metric: PerformanceMetric) => void> = [];
  private errorSubscribers: Array<(error: ErrorLog) => void> = [];

  constructor() {
    // Global unhandled error listening
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.logError({
          message: event.message || 'Unhandled Window Error',
          stack: event.error?.stack,
          severity: 'high',
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.logError({
          message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
          stack: event.reason?.stack,
          severity: 'medium',
        });
      });
    }
  }

  /**
   * Generates a distributed tracing ID for correlating requests.
   */
  public generateTraceId(): string {
    return `tr-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
  }

  /**
   * Records completed request metrics and informs subscribers.
   */
  public recordMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): PerformanceMetric {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: `met-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };

    this.metrics.unshift(fullMetric);
    if (this.metrics.length > this.maxBufferSize) {
      this.metrics.pop();
    }

    // Log error if failed
    if (!metric.success && metric.error) {
      this.logError({
        message: `API Call Failed [${metric.method} ${metric.url}]: ${metric.error}`,
        url: metric.url,
        method: metric.method,
        statusCode: metric.statusCode,
        severity: metric.statusCode && metric.statusCode >= 500 ? 'critical' : 'medium',
      });
    }

    // Notify listeners
    this.subscribers.forEach((fn) => {
      try {
        fn(fullMetric);
      } catch (err) {
        console.error('Failed to notify metric listener:', err);
      }
    });

    return fullMetric;
  }

  /**
   * Logs a structured error event.
   */
  public logError(error: Omit<ErrorLog, 'id' | 'timestamp'>): ErrorLog {
    const log: ErrorLog = {
      ...error,
      id: `err-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    this.errorLogs.unshift(log);
    if (this.errorLogs.length > this.maxBufferSize) {
      this.errorLogs.pop();
    }

    // Notify error listeners
    this.errorSubscribers.forEach((fn) => {
      try {
        fn(log);
      } catch (err) {
        console.error('Failed to notify error listener:', err);
      }
    });

    return log;
  }

  /**
   * Computes high-level aggregated performance metrics.
   */
  public getMetricsSummary(): MetricsSummary {
    const totalRequests = this.metrics.length;
    const successfulRequests = this.metrics.filter((m) => m.success).length;
    const failedRequests = totalRequests - successfulRequests;
    const successRatePercentage = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;

    let averageLatencyMs = 0;
    let p95LatencyMs = 0;
    let p99LatencyMs = 0;

    if (totalRequests > 0) {
      const sortedLatencies = [...this.metrics.map((m) => m.durationMs)].sort((a, b) => a - b);
      const sum = sortedLatencies.reduce((acc, curr) => acc + curr, 0);
      averageLatencyMs = Math.round(sum / totalRequests);

      const p95Index = Math.min(Math.floor(totalRequests * 0.95), totalRequests - 1);
      const p99Index = Math.min(Math.floor(totalRequests * 0.99), totalRequests - 1);

      p95LatencyMs = Math.round(sortedLatencies[p95Index] || 0);
      p99LatencyMs = Math.round(sortedLatencies[p99Index] || 0);
    }

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      successRatePercentage: Number(successRatePercentage.toFixed(1)),
      averageLatencyMs,
      p95LatencyMs,
      p99LatencyMs,
      activeErrorsCount: this.errorLogs.length,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
      leadArchitect: 'Chowra Engineering Team',
    };
  }

  /**
   * Retrieves recent raw metrics.
   */
  public getRecentMetrics(limit = 20): PerformanceMetric[] {
    return this.metrics.slice(0, limit);
  }

  /**
   * Retrieves recent error logs.
   */
  public getRecentErrors(limit = 20): ErrorLog[] {
    return this.errorLogs.slice(0, limit);
  }

  /**
   * Subscribe to real-time metric events.
   */
  public subscribeToMetrics(callback: (metric: PerformanceMetric) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((fn) => fn !== callback);
    };
  }

  /**
   * Subscribe to real-time error events.
   */
  public subscribeToErrors(callback: (error: ErrorLog) => void): () => void {
    this.errorSubscribers.push(callback);
    return () => {
      this.errorSubscribers = this.errorSubscribers.filter((fn) => fn !== callback);
    };
  }

  /**
   * Clears accumulated metrics and logs.
   */
  public reset(): void {
    this.metrics = [];
    this.errorLogs = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitorService();
