import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Mock IntersectionObserver for Framer Motion
class IntersectionObserverMock {
  observe = () => null;
  unobserve = () => null;
  disconnect = () => null;
}

global.IntersectionObserver = IntersectionObserverMock as any;

// Cleanup after each test
afterEach(() => {
  cleanup();
});
