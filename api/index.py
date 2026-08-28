"""
Vercel Serverless Function - FastAPI Backend Gateway
"""
import sys
import os
from pathlib import Path

# Add api/backend and backend to sys.path
api_backend = str(Path(__file__).parent / "backend")
root_backend = str(Path(__file__).parent.parent / "backend")

for b_path in [api_backend, root_backend]:
    if os.path.exists(b_path) and b_path not in sys.path:
        sys.path.insert(0, b_path)

from main import app
