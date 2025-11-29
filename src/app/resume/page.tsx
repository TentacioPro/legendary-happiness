"use client";

import { useState, useEffect } from "react";
import { RESUME_VERSION, getVersionString } from "@/utils/resume-version";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";

export default function ResumePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logger.trackEvent("resume_page_view", {
      version: RESUME_VERSION.version,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleDownload = () => {
    logger.trackEvent("resume_download", {
      version: RESUME_VERSION.version,
      fileName: RESUME_VERSION.fileName,
    });
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Resume</h1>
          <div className="flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-4">
            <span className="flex items-center justify-center gap-2 sm:justify-start">
              <FileText className="h-4 w-4" />
              {getVersionString()}
            </span>
            <span className="flex items-center justify-center gap-2 sm:justify-start">
              <Calendar className="h-4 w-4" />
              Last Updated: {RESUME_VERSION.lastUpdated}
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownload}
          className="flex items-center gap-2"
          size="lg"
        >
          <Download className="h-5 w-5" />
          Download PDF
        </Button>
      </div>

      {/* PDF Viewer Section */}
      <div className="relative overflow-hidden rounded-lg border bg-white shadow-lg">
        {isLoading && (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              <p className="text-gray-600">Loading resume...</p>
            </div>
          </div>
        )}

        <iframe
          src="/resume/Abishek_Maharajan_Resume.pdf"
          className="h-[calc(100vh-200px)] min-h-[600px] w-full"
          title="Resume PDF Viewer"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Info Section */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
        <p className="font-semibold">Note:</p>
        <p>
          This resume is version-tracked and regularly updated. The version
          number follows semantic versioning (major.minor.patch).
        </p>
      </div>
    </div>
  );
}
