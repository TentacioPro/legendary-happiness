"use client";

import {
  BarChart3,
  TrendingUp,
  Users,
  MousePointerClick,
  Download,
  Loader2,
} from "lucide-react";
import { useAnalyticsMetrics, useRecentEvents } from "@/hooks/useAnalytics";

/**
 * Analytics Dashboard Page
 *
 * This page provides visualization of collected analytics data.
 * Currently contains placeholder components - wire up to your data source.
 *
 * Data Integration Options:
 * 1. Google Sheets API - Read data from a Google Sheet
 * 2. Vercel KV/Redis - Store and retrieve analytics data
 * 3. Custom Backend API - Fetch from your own database
 * 4. Local Storage - For development/testing
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {change && (
            <p className="mt-1 text-sm text-green-600">
              <TrendingUp className="inline h-4 w-4" /> {change}
            </p>
          )}
        </div>
        <div className="rounded-full bg-blue-100 p-3 text-blue-600">{icon}</div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { metrics, loading: metricsLoading, error: metricsError } = useAnalyticsMetrics();
  const { events, loading: eventsLoading } = useRecentEvents(10);

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track visitor engagement and portfolio performance metrics
            {metricsError && (
              <span className="ml-2 text-xs text-amber-600">
                ({metricsError})
              </span>
            )}
          </p>
        </div>

        {/* Metrics Grid */}
        {metricsLoading ? (
          <div className="mb-8 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Page Views"
              value={metrics.pageViews.toLocaleString()}
              change="+12% from last month"
              icon={<BarChart3 className="h-6 w-6" />}
            />
            <MetricCard
              title="Unique Visitors"
              value={metrics.uniqueVisitors.toLocaleString()}
              change="+8% from last month"
              icon={<Users className="h-6 w-6" />}
            />
            <MetricCard
              title="Link Clicks"
              value={metrics.linkClicks.toLocaleString()}
              change="+15% from last month"
              icon={<MousePointerClick className="h-6 w-6" />}
            />
            <MetricCard
              title="Resume Downloads"
              value={metrics.resumeDownloads.toLocaleString()}
              change="+20% from last month"
              icon={<Download className="h-6 w-6" />}
            />
          </div>
        )}

        {/* Chart Placeholders */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Page Views Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Page Views Over Time</h2>
            <div className="flex h-64 items-center justify-center rounded bg-gray-50">
              <div className="text-center text-gray-500">
                <BarChart3 className="mx-auto mb-2 h-12 w-12" />
                <p className="text-sm">Chart Component Placeholder</p>
                <p className="mt-1 text-xs">
                  Integrate with Recharts, Chart.js, or Nivo
                </p>
              </div>
            </div>
          </div>

          {/* Top Links Chart */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Top Clicked Links</h2>
            <div className="flex h-64 items-center justify-center rounded bg-gray-50">
              <div className="text-center text-gray-500">
                <MousePointerClick className="mx-auto mb-2 h-12 w-12" />
                <p className="text-sm">Chart Component Placeholder</p>
                <p className="mt-1 text-xs">
                  Display top 5 most clicked contact links
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold text-blue-900">
            Data Integration Guide
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Step 1:</strong> Configure your analytics endpoint in{" "}
              <code className="rounded bg-blue-100 px-2 py-1">
                src/lib/analytics.ts
              </code>
            </p>
            <p>
              <strong>Step 2:</strong> Set up data collection backend (Google
              Sheets API, custom API, etc.)
            </p>
            <p>
              <strong>Step 3:</strong> Create API route at{" "}
              <code className="rounded bg-blue-100 px-2 py-1">
                src/app/api/analytics/route.ts
              </code>
            </p>
            <p>
              <strong>Step 4:</strong> Fetch data in this component using{" "}
              <code className="rounded bg-blue-100 px-2 py-1">useEffect</code>{" "}
              and update state
            </p>
            <p>
              <strong>Step 5:</strong> Install chart library:{" "}
              <code className="rounded bg-blue-100 px-2 py-1">
                npm install recharts
              </code>
            </p>
          </div>
          <div className="mt-4">
            <a
              href="/docs/agent-log"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Analytics Documentation →
            </a>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Recent Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium">Event Type</th>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {eventsLoading ? (
                  <tr>
                    <td className="px-4 py-8 text-center" colSpan={3}>
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr className="border-b">
                    <td className="px-4 py-3 text-gray-500" colSpan={3}>
                      No events recorded yet. Start browsing to see analytics data.
                    </td>
                  </tr>
                ) : (
                  events.map((event, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{event.eventType}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {event.properties
                          ? JSON.stringify(event.properties).substring(0, 50)
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
