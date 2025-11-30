/**
 * Analytics Data Collection Module
 * Handles event tracking and data collection for analytics dashboard
 * Uses Golden Schema from @portfolio/types for type safety
 */

import { logger } from "./logger";
import type { AnalyticsEvent, AnalyticsEventResponse } from "@portfolio/types";
import { AnalyticsEventType } from "@portfolio/types";

/**
 * Analytics Service
 * Collects and sends analytics data to external endpoint
 */
class AnalyticsService {
  private endpoint: string;
  private sessionId: string;
  private isEnabled: boolean;

  constructor() {
    // Configure analytics endpoint - points to API Gateway
    this.endpoint =
      process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
    this.sessionId = this.generateSessionId();
    // Enable in all environments for testing (fire-and-forget)
    this.isEnabled = true;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track analytics event (Hybrid: GA4 + Custom API)
   */
  async trackEvent(
    eventType: AnalyticsEventType,
    properties?: Record<string, any>,
  ): Promise<void> {
    const event: AnalyticsEvent = {
      eventType,
      timestamp: new Date().toISOString(),
      properties,
      sessionId: this.sessionId,
      userAgent:
        typeof window !== "undefined" ? window.navigator.userAgent : undefined,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    // Log event locally
    logger.trackEvent(eventType, properties);

    // Send to Custom API Gateway (if enabled)
    if (this.isEnabled) {
      try {
        await this.sendToEndpoint(event);
      } catch (error) {
        logger.error(
          "Failed to send analytics event",
          { event },
          error as Error,
        );
      }
    }

    // Send to Google Analytics (if available)
    this.sendToGA4(eventType, properties);
  }

  /**
   * Send event to Google Analytics 4
   */
  private sendToGA4(
    eventType: AnalyticsEventType,
    properties?: Record<string, any>,
  ): void {
    if (typeof window === "undefined") return;

    // Check if gtag is available (loaded by @next/third-parties)
    if (typeof (window as any).gtag === "function") {
      (window as any).gtag("event", eventType, properties);
    }
  }

  /**
   * Send event to analytics endpoint (API Gateway)
   * Fire-and-forget: fails gracefully without crashing UI
   */
  private async sendToEndpoint(event: AnalyticsEvent): Promise<void> {
    if (typeof window === "undefined") return;

    try {
      const response = await fetch(`${this.endpoint}/api/analytics/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Analytics endpoint returned ${response.status}`);
      }

      const result: AnalyticsEventResponse = await response.json();

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Analytics event tracked:", result);
      }
    } catch (error) {
      // Fire-and-forget: silently fail to not disrupt user experience
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Analytics endpoint unavailable:", error);
      }
    }
  }

  /**
   * Track page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.PAGE_VIEW, {
      pageName,
      ...properties,
    });
  }

  /**
   * Track link click
   */
  trackLinkClick(
    linkName: string,
    targetUrl: string,
    properties?: Record<string, any>,
  ): void {
    this.trackEvent(AnalyticsEventType.LINK_CLICK, {
      linkName,
      targetUrl,
      ...properties,
    });
  }

  /**
   * Track resume download
   */
  trackResumeDownload(version: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.RESUME_DOWNLOAD, {
      version,
      ...properties,
    });
  }

  /**
   * Track contact click
   */
  trackContactClick(
    contactType: string,
    properties?: Record<string, any>,
  ): void {
    this.trackEvent(AnalyticsEventType.CONTACT_CLICK, {
      contactType,
      ...properties,
    });
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();
