/**
 * Analytics Data Collection Module
 * Handles event tracking and data collection for analytics dashboard
 */

import { logger } from "./logger";

export enum AnalyticsEventType {
  PAGE_VIEW = "page_view",
  LINK_CLICK = "link_click",
  RESUME_DOWNLOAD = "resume_download",
  RESUME_VIEW = "resume_view",
  CONTACT_CLICK = "contact_click",
}

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  timestamp: string;
  properties?: Record<string, any>;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}

/**
 * Analytics Service
 * Collects and sends analytics data to external endpoint
 */
class AnalyticsService {
  private endpoint: string;
  private sessionId: string;
  private isEnabled: boolean;

  constructor() {
    // Configure analytics endpoint (placeholder for now)
    this.endpoint =
      process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || "/api/analytics";
    this.sessionId = this.generateSessionId();
    this.isEnabled = process.env.NODE_ENV === "production";
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Track analytics event
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

    // Send to external endpoint (if enabled)
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
  }

  /**
   * Send event to analytics endpoint
   * This is a placeholder - integrate with your analytics service
   */
  private async sendToEndpoint(event: AnalyticsEvent): Promise<void> {
    // Placeholder implementation
    // Replace with actual API call to your analytics service
    // Examples:
    // - Google Analytics 4
    // - Plausible Analytics
    // - Custom backend endpoint
    // - Google Sheets API

    if (typeof window === "undefined") return;

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`Analytics endpoint returned ${response.status}`);
      }
    } catch (error) {
      // Silently fail in production to not disrupt user experience
      if (process.env.NODE_ENV === "development") {
        console.warn("Analytics endpoint not configured:", error);
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

/**
 * Expected Analytics Endpoint Payload Structure
 *
 * POST /api/analytics
 * Content-Type: application/json
 *
 * {
 *   "eventType": "page_view" | "link_click" | "resume_download" | "contact_click",
 *   "timestamp": "2024-11-29T12:00:00.000Z",
 *   "properties": {
 *     "pageName": "home",
 *     "linkName": "GitHub",
 *     "targetUrl": "https://github.com/...",
 *     "version": "v2.4.1",
 *     "contactType": "email"
 *   },
 *   "sessionId": "session_1234567890_abc123",
 *   "userAgent": "Mozilla/5.0...",
 *   "url": "https://www.abishek-maharajan.online/"
 * }
 *
 * Integration Options:
 * 1. Google Sheets API: https://developers.google.com/sheets/api
 * 2. Vercel Analytics: https://vercel.com/analytics
 * 3. Plausible Analytics: https://plausible.io/docs/events-api
 * 4. Custom Backend: Create your own API endpoint
 */
