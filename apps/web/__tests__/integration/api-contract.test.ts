/**
 * API Contract Test
 * Verifies that the frontend analytics module sends requests
 * that comply with the Golden Schema (AnalyticsEvent)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { analytics } from "../../src/lib/analytics";
import { AnalyticsEventType } from "@portfolio/types";
import { z } from "zod";

// Golden Schema validation (matches API Gateway)
const AnalyticsEventSchema = z.object({
  eventType: z.enum([
    "page_view",
    "link_click",
    "resume_download",
    "resume_view",
    "contact_click",
  ]),
  timestamp: z.string().datetime(),
  properties: z.record(z.any()).optional(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  url: z.string().url().optional(),
});

describe("API Contract: Analytics Events", () => {
  beforeEach(() => {
    // Mock fetch globally
    global.fetch = vi.fn();
  });

  it("should send page_view event with valid schema", async () => {
    // Mock successful response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Event tracked successfully",
        eventId: "evt_123",
      }),
    });

    // Track a page view event
    await analytics.trackPageView("home", { section: "hero" });

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Extract the call arguments
    const [url, options] = (global.fetch as any).mock.calls[0];

    // Verify URL
    expect(url).toBe("http://localhost:3001/api/analytics/events");

    // Verify method and headers
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");

    // Parse the body
    const payload = JSON.parse(options.body);

    // CRITICAL: Verify payload matches Golden Schema
    const validationResult = AnalyticsEventSchema.safeParse(payload);
    expect(validationResult.success).toBe(true);

    // Verify specific fields
    expect(payload.eventType).toBe("page_view");
    expect(payload.properties).toEqual({
      pageName: "home",
      section: "hero",
    });
    expect(payload.sessionId).toBeDefined();
    expect(payload.timestamp).toBeDefined();
  });

  it("should send link_click event with valid schema", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await analytics.trackLinkClick("GitHub", "https://github.com/example");

    const [, options] = (global.fetch as any).mock.calls[0];
    const payload = JSON.parse(options.body);

    // Validate against Golden Schema
    const validationResult = AnalyticsEventSchema.safeParse(payload);
    expect(validationResult.success).toBe(true);

    expect(payload.eventType).toBe("link_click");
    expect(payload.properties.linkName).toBe("GitHub");
    expect(payload.properties.targetUrl).toBe("https://github.com/example");
  });

  it("should send resume_download event with valid schema", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await analytics.trackResumeDownload("v2.4.1");

    const [, options] = (global.fetch as any).mock.calls[0];
    const payload = JSON.parse(options.body);

    // Validate against Golden Schema
    const validationResult = AnalyticsEventSchema.safeParse(payload);
    expect(validationResult.success).toBe(true);

    expect(payload.eventType).toBe("resume_download");
    expect(payload.properties.version).toBe("v2.4.1");
  });

  it("should send contact_click event with valid schema", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await analytics.trackContactClick("email");

    const [, options] = (global.fetch as any).mock.calls[0];
    const payload = JSON.parse(options.body);

    // Validate against Golden Schema
    const validationResult = AnalyticsEventSchema.safeParse(payload);
    expect(validationResult.success).toBe(true);

    expect(payload.eventType).toBe("contact_click");
    expect(payload.properties.contactType).toBe("email");
  });

  it("should fail gracefully when API is unavailable", async () => {
    // Mock network failure
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    // Should not throw - fire-and-forget behavior
    await expect(async () => {
      await analytics.trackPageView("home");
    }).not.toThrow();
  });

  it("should fail gracefully when API returns error", async () => {
    // Mock API error response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // Should not throw - fire-and-forget behavior
    await expect(async () => {
      await analytics.trackPageView("home");
    }).not.toThrow();
  });
});
