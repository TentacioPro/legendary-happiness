import { useState, useEffect } from "react";

interface AnalyticsMetrics {
  pageViews: number;
  uniqueVisitors: number;
  linkClicks: number;
  resumeDownloads: number;
}

interface AnalyticsEvent {
  eventType: string;
  timestamp: string;
  properties?: Record<string, any>;
}

export function useAnalyticsMetrics() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    pageViews: 0,
    uniqueVisitors: 0,
    linkClicks: 0,
    resumeDownloads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/api/analytics/metrics`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.status}`);
        }

        const data = await response.json();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.warn("Analytics API unavailable, using placeholder data:", err);
        // Use placeholder data when API is unavailable
        setMetrics({
          pageViews: 1234,
          uniqueVisitors: 567,
          linkClicks: 89,
          resumeDownloads: 45,
        });
        setError("API unavailable - showing placeholder data");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error };
}

export function useRecentEvents(limit: number = 10) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:3001";
        const response = await fetch(
          `${apiUrl}/api/analytics/events?limit=${limit}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data.events || []);
        setError(null);
      } catch (err) {
        console.warn("Analytics API unavailable:", err);
        setEvents([]);
        setError("API unavailable");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    // Refresh every 10 seconds
    const interval = setInterval(fetchEvents, 10000);
    return () => clearInterval(interval);
  }, [limit]);

  return { events, loading, error };
}
