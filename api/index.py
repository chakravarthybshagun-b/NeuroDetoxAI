"""
Vercel Serverless Function - FastAPI Backend Gateway
"""
import sys
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Try both api/backend directory and root backend directory
api_backend = str(Path(__file__).parent / "backend")
root_backend = str(Path(__file__).parent.parent / "backend")

for b_path in [api_backend, root_backend]:
    if os.path.exists(b_path) and b_path not in sys.path:
        sys.path.insert(0, b_path)

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
        return {"status": "error", "message": "Failed to load FastAPI backend", "error": str(e)}
