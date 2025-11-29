/**
 * Resume Version Tracking Utility
 * Centralized version management for resume documents
 */

export interface ResumeVersion {
  version: string;
  lastUpdated: string;
  fileName: string;
}

/**
 * Current resume version information
 * Update this object whenever the resume is modified
 */
export const RESUME_VERSION: ResumeVersion = {
  version: "v2.4.1",
  lastUpdated: "2024-11-29",
  fileName: "Abishek_Maharajan_Resume.pdf",
};

/**
 * Get formatted version string
 */
export function getVersionString(): string {
  return `Version ${RESUME_VERSION.version} (Updated: ${RESUME_VERSION.lastUpdated})`;
}

/**
 * Get resume file path
 */
export function getResumeFilePath(): string {
  return `/resume/${RESUME_VERSION.fileName}`;
}

/**
 * Validate version format (semantic versioning)
 */
export function isValidVersion(version: string): boolean {
  const semverRegex = /^v?\d+\.\d+\.\d+$/;
  return semverRegex.test(version);
}
