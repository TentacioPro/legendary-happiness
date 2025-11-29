/**
 * Golden Schema: Analytics Event Types
 * This schema defines the contract for analytics events across the system.
 * CRITICAL: Must match the Zod schema in api-gateway/src/routes/analytics.js
 */
/**
 * Analytics event types
 */
export declare enum AnalyticsEventType {
    PAGE_VIEW = "page_view",
    LINK_CLICK = "link_click",
    RESUME_DOWNLOAD = "resume_download",
    RESUME_VIEW = "resume_view",
    CONTACT_CLICK = "contact_click"
}
/**
 * Core Analytics Event interface
 * This is the Golden Schema for all analytics events
 */
export interface AnalyticsEvent {
    eventType: AnalyticsEventType;
    timestamp: string;
    properties?: Record<string, any>;
    sessionId?: string;
    userAgent?: string;
    url?: string;
}
/**
 * Response from analytics event tracking
 */
export interface AnalyticsEventResponse {
    success: boolean;
    message: string;
    eventId?: string;
    error?: string;
    details?: any;
}
