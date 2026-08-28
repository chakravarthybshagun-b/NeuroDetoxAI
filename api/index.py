"""
Vercel Serverless Function Entry Point for FastAPI Backend
"""
import sys
import os

# Add backend to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app

# Vercel expects a WSGI or ASGI app
# FastAPI is ASGI-compatible, so we export it directly
handler = app
