"""
Golden Schema: Learning Asset Types (Python)
This schema defines the contract for all learning assets across the system.
CRITICAL: Any changes here must be synced with src/learning.ts
"""

from enum import Enum
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class SourceType(str, Enum):
    """Source types for learning assets"""
    YOUTUBE_VIDEO = "YOUTUBE_VIDEO"
    ARTICLE = "ARTICLE"
    GITHUB_REPO = "GITHUB_REPO"
    PDF_DOCUMENT = "PDF_DOCUMENT"
    TWEET = "TWEET"


class ProcessingStatus(str, Enum):
    """Status of learning asset processing"""
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class AssetMetadata(BaseModel):
    """Flexible metadata structure for different source types"""
    
    # YouTube specific
    video_id: Optional[str] = Field(None, alias="videoId")
    channel_name: Optional[str] = Field(None, alias="channelName")
    duration: Optional[int] = None
    
    # Article specific
    url: Optional[str] = None
    author: Optional[str] = None
    publish_date: Optional[str] = Field(None, alias="publishDate")
    
    # GitHub specific
    repo_url: Optional[str] = Field(None, alias="repoUrl")
    repo_owner: Optional[str] = Field(None, alias="repoOwner")
    repo_name: Optional[str] = Field(None, alias="repoName")
    stars: Optional[int] = None
    language: Optional[str] = None
    
    # PDF specific
    file_size: Optional[int] = Field(None, alias="fileSize")
    page_count: Optional[int] = Field(None, alias="pageCount")
    
    # Tweet specific
    tweet_id: Optional[str] = Field(None, alias="tweetId")
    username: Optional[str] = None
    
    # Common fields
    tags: Optional[List[str]] = None
    difficulty: Optional[str] = None  # 'beginner' | 'intermediate' | 'advanced'
    estimated_time: Optional[int] = Field(None, alias="estimatedTime")  # in minutes
    
    class Config:
        populate_by_name = True


class LearningAsset(BaseModel):
    """Core Learning Asset model"""
    
    id: str
    title: str
    description: Optional[str] = None
    source_type: SourceType = Field(..., alias="sourceType")
    source_url: str = Field(..., alias="sourceUrl")
    metadata: AssetMetadata
    status: ProcessingStatus
    created_at: datetime = Field(..., alias="createdAt")
    updated_at: datetime = Field(..., alias="updatedAt")
    processed_at: Optional[datetime] = Field(None, alias="processedAt")
    
    # AI-generated fields
    summary: Optional[str] = None
    key_takeaways: Optional[List[str]] = Field(None, alias="keyTakeaways")
    topics: Optional[List[str]] = None
    
    # User interaction
    user_id: Optional[str] = Field(None, alias="userId")
    notes: Optional[str] = None
    rating: Optional[int] = None
    
    class Config:
        populate_by_name = True


class CreateLearningAssetRequest(BaseModel):
    """Request to create a new learning asset"""
    
    title: str
    description: Optional[str] = None
    source_type: SourceType = Field(..., alias="sourceType")
    source_url: str = Field(..., alias="sourceUrl")
    metadata: Optional[AssetMetadata] = None
    user_id: Optional[str] = Field(None, alias="userId")
    
    class Config:
        populate_by_name = True


class CreateLearningAssetResponse(BaseModel):
    """Response after creating a learning asset"""
    
    asset: LearningAsset
    message: str


class ListLearningAssetsQuery(BaseModel):
    """Query parameters for listing learning assets"""
    
    source_type: Optional[SourceType] = Field(None, alias="sourceType")
    status: Optional[ProcessingStatus] = None
    user_id: Optional[str] = Field(None, alias="userId")
    limit: Optional[int] = 10
    offset: Optional[int] = 0
    sort_by: Optional[str] = Field("createdAt", alias="sortBy")
    sort_order: Optional[str] = Field("desc", alias="sortOrder")
    
    class Config:
        populate_by_name = True
