"""
Vercel Serverless Function - FastAPI Backend
Simplified version with fallback
"""
import sys
import os
from pathlib import Path

# Add backend directory to path  
backend_path = str(Path(__file__).parent.parent / "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

try:
    # Try to import the actual FastAPI app
    print(f"Attempting to import from: {backend_path}")
    from main import app
    print("Successfully imported FastAPI app from backend/main.py")
    
except ImportError as e:
    print(f"Failed to import backend: {e}")
    # Fallback: Create minimal API
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    def root():
        return {"status": "Backend API (fallback mode)", "message": "Backend import failed"}
    
    @app.get("/health")
    def health():
        return {"status": "healthy", "mode": "fallback"}

except Exception as e:
    print(f"Unexpected error: {e}")
    import traceback
    traceback.print_exc()
    
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/health")
    def health():
        return {"status": "error", "error": str(e)}



