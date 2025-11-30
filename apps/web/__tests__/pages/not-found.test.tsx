import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import NotFoundPage from "@/app/not-found";

describe("404 Not Found Page", () => {
  it("renders 404 message", () => {
    render(<NotFoundPage />);
    expect(screen.getByText(/404|Not Found|Page Not Found/i)).toBeInTheDocument();
  });

  it("renders link back to home", () => {
    const { container } = render(<NotFoundPage />);
    const links = container.querySelectorAll('a[href="/"], a[href="home"]');
    expect(links.length).toBeGreaterThan(0);
  });

  describe("Mobile Responsiveness", () => {
    it("renders correctly on mobile viewport", () => {
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<NotFoundPage />);
      expect(screen.getByText(/404|Not Found|Page Not Found/i)).toBeInTheDocument();
    });
  });
});
