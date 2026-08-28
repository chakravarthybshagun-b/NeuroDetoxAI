"""
Vercel Serverless Function Entry Point for FastAPI Backend
"""
import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

try:
    # Import FastAPI app from backend
    from backend.main import app
    
    # Ensure CORS is configured
    from fastapi.middleware.cors import CORSMiddleware
    
    # Check if CORS middleware already exists, if not add it
    has_cors = any(
        isinstance(middleware.cls, type) and 
        issubclass(middleware.cls, CORSMiddleware) 
        for middleware in app.user_middleware
    )
    
    if not has_cors:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    # For Vercel, we need to export the app directly
    # Vercel will handle ASGI to HTTP translation
    
except Exception as e:
    print(f"Error loading FastAPI app: {e}")
    import traceback
    traceback.print_exc()
    
    # Fallback minimal app if import fails
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/health")
    def health():
        return {"status": "error", "message": str(e)}

