/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals (CLS, FID, LCP, FCP, TTFB) for performance observability
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from "web-vitals";
import { logger } from "./logger";

export function reportWebVitals(): void {
  // Only track in browser environment
  if (typeof window === "undefined") return;

  const handleMetric = (metric: Metric) => {
    const { name, value, rating, id } = metric;

    // Log metric
    logger.info(`Web Vital: ${name}`, {
      metric: name,
      value: Math.round(value),
      rating,
      id,
    });

    // Track as event for analytics
    logger.trackEvent("web_vital", {
      metric: name,
      value: Math.round(value),
      rating,
    });

    // Future: Send to analytics service
    // Example: Google Analytics
    // if (window.gtag) {
    //   window.gtag('event', name, {
    //     value: Math.round(value),
    //     metric_id: id,
    //     metric_value: value,
    //     metric_rating: rating,
    //   });
    // }
  };

  // Register all Core Web Vitals
  onCLS(handleMetric); // Cumulative Layout Shift
  onINP(handleMetric); // Interaction to Next Paint (replaces FID)
  onLCP(handleMetric); // Largest Contentful Paint
  onFCP(handleMetric); // First Contentful Paint
  onTTFB(handleMetric); // Time to First Byte
}

/**
 * Performance thresholds based on Google's recommendations
 */
export const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 }, // Replaces FID
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

/**
 * Check if a metric value is within acceptable range
 */
export function isMetricGood(metricName: string, value: number): boolean {
  const threshold =
    PERFORMANCE_THRESHOLDS[metricName as keyof typeof PERFORMANCE_THRESHOLDS];
  if (!threshold) return true;
  return value <= threshold.good;
}
