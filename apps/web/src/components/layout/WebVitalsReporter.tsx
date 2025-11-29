"use client";

import { useEffect } from "react";
import { reportWebVitals } from "@/lib/webVitals";

/**
 * Web Vitals Reporter Component
 * Initializes performance monitoring on client-side
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    // Initialize Web Vitals reporting
    reportWebVitals();
  }, []);

  // This component doesn't render anything
  return null;
}
