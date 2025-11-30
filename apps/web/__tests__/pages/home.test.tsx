import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import HomePage from "@/app/page";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    ul: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  useAnimation: () => ({
    start: vi.fn(),
    set: vi.fn(),
  }),
  useInView: () => true,
}));

// Mock analytics
vi.mock("@/lib/analytics", () => ({
  analytics: {
    trackPageView: vi.fn(),
    trackEvent: vi.fn(),
  },
}));

describe("Home Page", () => {
  beforeEach(() => {
    // Reset viewport before each test
    global.innerWidth = 1024;
    global.innerHeight = 768;
  });

  it("renders hero section with main heading", () => {
    render(<HomePage />);
    expect(
      screen.getByText(/Abishek Maharajan/i),
    ).toBeInTheDocument();
  });

  it("renders about section", () => {
    render(<HomePage />);
    expect(screen.getByText(/About/i)).toBeInTheDocument();
  });

  it("renders skills section", () => {
    render(<HomePage />);
    expect(screen.getByText(/Skills/i)).toBeInTheDocument();
  });

  it("renders contact section", () => {
    render(<HomePage />);
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  describe("Mobile Responsiveness", () => {
    it("renders correctly on mobile viewport (375px)", () => {
      // Mock mobile viewport
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<HomePage />);

      // Verify key elements are present
      expect(screen.getByText(/Abishek Maharajan/i)).toBeInTheDocument();
      expect(screen.getByText(/About/i)).toBeInTheDocument();
    });

    it("renders correctly on tablet viewport (768px)", () => {
      // Mock tablet viewport
      global.innerWidth = 768;
      global.innerHeight = 1024;

      render(<HomePage />);

      // Verify key elements are present
      expect(screen.getByText(/Abishek Maharajan/i)).toBeInTheDocument();
      expect(screen.getByText(/Skills/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic structure", () => {
      const { container } = render(<HomePage />);
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
    });
  });
});
