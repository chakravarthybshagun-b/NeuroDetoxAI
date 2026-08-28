"""
Vercel Serverless Function - FastAPI Backend Gateway
"""
import sys
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add backend directory to sys.path
backend_path = str(Path(__file__).parent.parent / "backend")
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

try:
    from main import app as backend_app
    
    app = FastAPI(title="NeuroDetox AI API Gateway")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Mount backend app for both /api subpath and root requests
    app.mount("/api", backend_app)
    app.mount("/", backend_app)
    
except Exception as e:
    import traceback
    traceback.print_exc()
    
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/health")
    @app.get("/api/health")
    def health():
        return {"status": "healthy", "mode": "fallback", "error": str(e)}




