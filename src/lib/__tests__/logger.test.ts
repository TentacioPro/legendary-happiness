import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger, LogLevel } from "../logger";

describe("Logger", () => {
  let consoleErrorSpy: any;
  let originalNodeEnv: string | undefined;

  beforeEach(() => {
    // Set NODE_ENV to development for tests
    originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
    vi.restoreAllMocks();
  });

  it("should log error messages", () => {
    logger.error("Test error message");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should log error with context", () => {
    const context = { userId: "123", action: "submit" };
    logger.error("Test error", context);

    expect(consoleErrorSpy).toHaveBeenCalled();
    const logOutput = consoleErrorSpy.mock.calls[0][0];
    expect(logOutput).toContain("Test error");
    expect(logOutput).toContain("userId");
  });

  it("should log error with Error object", () => {
    const error = new Error("Test error object");
    logger.error("Error occurred", {}, error);

    expect(consoleErrorSpy).toHaveBeenCalled();
    const logOutput = consoleErrorSpy.mock.calls[0][0];
    expect(logOutput).toContain("Error occurred");
  });

  it("should only log errors in production", () => {
    process.env.NODE_ENV = "production";
    const consoleWarnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => {});
    const consoleInfoSpy = vi
      .spyOn(console, "info")
      .mockImplementation(() => {});

    logger.warn("Test warning");
    logger.info("Test info");

    expect(consoleWarnSpy).not.toHaveBeenCalled();
    expect(consoleInfoSpy).not.toHaveBeenCalled();

    // But errors should still be logged
    logger.error("Test error");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("should format structured logs correctly", () => {
    logger.error("Test message", { key: "value" });

    expect(consoleErrorSpy).toHaveBeenCalled();
    const logOutput = consoleErrorSpy.mock.calls[0][0];

    // In development, check for formatted output
    expect(logOutput).toContain("ERROR");
    expect(logOutput).toContain("Test message");
    expect(logOutput).toContain("key");
  });
});
