/**
 * Golden Schema: Learning Asset Types
 * This schema defines the contract for all learning assets across the system.
 * CRITICAL: Any changes here must be synced with python/schemas.py
 */

/**
 * Source types for learning assets
 * Supports diverse ingestion sources
 */
export enum SourceType {
  YOUTUBE_VIDEO = 'YOUTUBE_VIDEO',
  ARTICLE = 'ARTICLE',
  GITHUB_REPO = 'GITHUB_REPO',
  PDF_DOCUMENT = 'PDF_DOCUMENT',
  TWEET = 'TWEET',
}

/**
 * Status of learning asset processing
 */
export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

/**
 * Flexible metadata structure for different source types
 */
export interface AssetMetadata {
  // YouTube specific
  videoId?: string;
  channelName?: string;
  duration?: number;
  
  // Article specific
  url?: string;
  author?: string;
  publishDate?: string;
  
  // GitHub specific
  repoUrl?: string;
  repoOwner?: string;
  repoName?: string;
  stars?: number;
  language?: string;
  
  // PDF specific
  fileSize?: number;
  pageCount?: number;
  
  // Tweet specific
  tweetId?: string;
  username?: string;
  
  // Common fields
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // in minutes
}

/**
 * Core Learning Asset interface
 */
export interface LearningAsset {
  id: string;
  title: string;
  description?: string;
  sourceType: SourceType;
  sourceUrl: string;
  metadata: AssetMetadata;
  status: ProcessingStatus;
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  
  // AI-generated fields
  summary?: string;
  keyTakeaways?: string[];
  topics?: string[];
  
  // User interaction
  userId?: string;
  notes?: string;
  rating?: number;
}

/**
 * Request to create a new learning asset
 */
export interface CreateLearningAssetRequest {
  title: string;
  description?: string;
  sourceType: SourceType;
  sourceUrl: string;
  metadata?: Partial<AssetMetadata>;
  userId?: string;
}

/**
 * Response after creating a learning asset
 */
export interface CreateLearningAssetResponse {
  asset: LearningAsset;
  message: string;
}

/**
 * Query parameters for listing learning assets
 */
export interface ListLearningAssetsQuery {
  sourceType?: SourceType;
  status?: ProcessingStatus;
  userId?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
