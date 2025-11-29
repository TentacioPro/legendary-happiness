"use strict";
/**
 * Golden Schema: Learning Asset Types
 * This schema defines the contract for all learning assets across the system.
 * CRITICAL: Any changes here must be synced with python/schemas.py
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingStatus = exports.SourceType = void 0;
/**
 * Source types for learning assets
 * Supports diverse ingestion sources
 */
var SourceType;
(function (SourceType) {
    SourceType["YOUTUBE_VIDEO"] = "YOUTUBE_VIDEO";
    SourceType["ARTICLE"] = "ARTICLE";
    SourceType["GITHUB_REPO"] = "GITHUB_REPO";
    SourceType["PDF_DOCUMENT"] = "PDF_DOCUMENT";
    SourceType["TWEET"] = "TWEET";
})(SourceType || (exports.SourceType = SourceType = {}));
/**
 * Status of learning asset processing
 */
var ProcessingStatus;
(function (ProcessingStatus) {
    ProcessingStatus["PENDING"] = "PENDING";
    ProcessingStatus["PROCESSING"] = "PROCESSING";
    ProcessingStatus["COMPLETED"] = "COMPLETED";
    ProcessingStatus["FAILED"] = "FAILED";
})(ProcessingStatus || (exports.ProcessingStatus = ProcessingStatus = {}));
