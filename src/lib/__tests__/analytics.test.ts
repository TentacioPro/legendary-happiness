import { describe, it, expect, vi, beforeEach } from "vitest";
import { AnalyticsEventType } from "../analytics";

// Mock the analytics module to avoid actual API calls in tests
vi.mock("../analytics", async () => {
  const actual = await vi.importActual("../analytics");
  return {
    ...actual,
    analytics: {
      trackEvent: vi.fn(),
      trackPageView: vi.fn(),
      trackLinkClick: vi.fn(),
      trackResumeDownload: vi.fn(),
      trackContactClick: vi.fn(),
    },
  };
});

describe("Analytics Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should define all required event types", () => {
    expect(AnalyticsEventType.PAGE_VIEW).toBe("page_view");
    expect(AnalyticsEventType.LINK_CLICK).toBe("link_click");
    expect(AnalyticsEventType.RESUME_DOWNLOAD).toBe("resume_download");
    expect(AnalyticsEventType.RESUME_VIEW).toBe("resume_view");
    expect(AnalyticsEventType.CONTACT_CLICK).toBe("contact_click");
  });

  it("should have correct event type values", () => {
    const eventTypes = Object.values(AnalyticsEventType);
    expect(eventTypes).toContain("page_view");
    expect(eventTypes).toContain("link_click");
    expect(eventTypes).toContain("resume_download");
    expect(eventTypes).toContain("contact_click");
  });

  it("should export analytics service", async () => {
    const { analytics } = await import("../analytics");
    expect(analytics).toBeDefined();
    expect(analytics.trackEvent).toBeDefined();
    expect(analytics.trackPageView).toBeDefined();
    expect(analytics.trackLinkClick).toBeDefined();
    expect(analytics.trackResumeDownload).toBeDefined();
    expect(analytics.trackContactClick).toBeDefined();
  });
});
