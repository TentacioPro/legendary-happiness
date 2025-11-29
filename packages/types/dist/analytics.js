"use strict";
/**
 * Golden Schema: Analytics Event Types
 * This schema defines the contract for analytics events across the system.
 * CRITICAL: Must match the Zod schema in api-gateway/src/routes/analytics.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsEventType = void 0;
/**
 * Analytics event types
 */
var AnalyticsEventType;
(function (AnalyticsEventType) {
    AnalyticsEventType["PAGE_VIEW"] = "page_view";
    AnalyticsEventType["LINK_CLICK"] = "link_click";
    AnalyticsEventType["RESUME_DOWNLOAD"] = "resume_download";
    AnalyticsEventType["RESUME_VIEW"] = "resume_view";
    AnalyticsEventType["CONTACT_CLICK"] = "contact_click";
})(AnalyticsEventType || (exports.AnalyticsEventType = AnalyticsEventType = {}));
