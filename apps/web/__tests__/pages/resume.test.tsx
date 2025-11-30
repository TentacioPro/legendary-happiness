import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResumePage from "@/app/resume/page";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
  },
}));

describe("Resume Page", () => {
  it("renders resume page heading", () => {
    render(<ResumePage />);
    expect(screen.getByRole("heading", { name: /Resume/i })).toBeInTheDocument();
  });

  it("renders download button or link", () => {
    const { container } = render(<ResumePage />);
    // Check for download-related elements
    const downloadElements = container.querySelectorAll('[href*="resume"], [href*="cv"], button');
    expect(downloadElements.length).toBeGreaterThan(0);
  });

  describe("Mobile Responsiveness", () => {
    it("renders correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<ResumePage />);
      expect(screen.getByRole("heading", { name: /Resume/i })).toBeInTheDocument();
    });
  });
});
