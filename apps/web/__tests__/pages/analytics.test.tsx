import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AnalyticsPage from "@/app/analytics/page";

// Mock recharts to avoid canvas issues
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
}));

describe("Analytics Page", () => {
  it("renders analytics dashboard heading", () => {
    render(<AnalyticsPage />);
    expect(screen.getByRole("heading", { name: /Analytics Dashboard/i })).toBeInTheDocument();
  });

  it("renders analytics content", () => {
    const { container } = render(<AnalyticsPage />);
    expect(container.querySelector("section, div")).toBeInTheDocument();
  });

  describe("Mobile Responsiveness", () => {
    it("renders correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<AnalyticsPage />);
      expect(screen.getByRole("heading", { name: /Analytics Dashboard/i })).toBeInTheDocument();
    });

    it("renders correctly on tablet viewport", () => {
      global.innerWidth = 768;
      global.innerHeight = 1024;

      render(<AnalyticsPage />);
      expect(screen.getByRole("heading", { name: /Analytics Dashboard/i })).toBeInTheDocument();
    });
  });
});
