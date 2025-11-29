import { describe, it, expect } from "vitest";
import {
  RESUME_VERSION,
  getVersionString,
  getResumeFilePath,
  isValidVersion,
} from "../resume-version";

describe("Resume Version Utility", () => {
  it("should have valid version format", () => {
    expect(isValidVersion(RESUME_VERSION.version)).toBe(true);
  });

  it("should return formatted version string", () => {
    const versionString = getVersionString();
    expect(versionString).toContain(RESUME_VERSION.version);
    expect(versionString).toContain(RESUME_VERSION.lastUpdated);
  });

  it("should return correct resume file path", () => {
    const filePath = getResumeFilePath();
    expect(filePath).toContain("/resume/");
    expect(filePath).toContain(RESUME_VERSION.fileName);
  });

  it("should validate semantic version format", () => {
    expect(isValidVersion("v1.0.0")).toBe(true);
    expect(isValidVersion("2.4.1")).toBe(true);
    expect(isValidVersion("v2.4.1")).toBe(true);
    expect(isValidVersion("invalid")).toBe(false);
    expect(isValidVersion("1.0")).toBe(false);
  });

  it("should have lastUpdated in valid date format", () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    expect(dateRegex.test(RESUME_VERSION.lastUpdated)).toBe(true);
  });
});
