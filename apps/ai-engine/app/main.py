"""
AI Engine - FastAPI Application
Handles AI-powered learning asset processing and ingestion
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add shared_types to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from shared_types.schemas import SourceType, ProcessingStatus

app = FastAPI(
    title="Learning Dashboard AI Engine",
    description="AI-powered learning asset processing with multi-source ingestion",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "AI Engine",
        "status": "healthy",
        "version": "1.0.0",
        "capabilities": {
            "ingestion_sources": [source.value for source in SourceType],
            "processing_statuses": [status.value for status in ProcessingStatus]
        }
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",  # TODO: Add actual DB check
        "redis": "connected",     # TODO: Add actual Redis check
        "ingestion_tools": {
            "youtube": "ready",
            "articles": "ready",
            "github": "ready",
            "pdf": "ready",
            "twitter": "ready"
        }
    }


@app.get("/api/v1/sources")
async def list_supported_sources():
    """List all supported ingestion sources"""
    return {
        "sources": [
            {
                "type": SourceType.YOUTUBE_VIDEO.value,
                "description": "YouTube video transcripts and metadata",
                "required_fields": ["videoId", "url"]
            },
            {
                "type": SourceType.ARTICLE.value,
                "description": "Web articles and blog posts",
                "required_fields": ["url"]
            },
            {
                "type": SourceType.GITHUB_REPO.value,
                "description": "GitHub repositories and code analysis",
                "required_fields": ["repoUrl", "repoOwner", "repoName"]
            },
            {
                "type": SourceType.PDF_DOCUMENT.value,
                "description": "PDF documents and papers",
                "required_fields": ["url", "fileSize"]
            },
            {
                "type": SourceType.TWEET.value,
                "description": "Twitter/X posts and threads",
                "required_fields": ["tweetId", "username"]
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
