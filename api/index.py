"""
Vercel Serverless Function Entry Point for FastAPI Backend
"""
import sys
import os

# Add backend to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import importlib.util

# Import modules from backend
spec = importlib.util.spec_from_file_location("main", os.path.join(os.path.dirname(__file__), '..', 'backend', 'main.py'))
main_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(main_module)

app = main_module.app

# Ensure CORS is enabled
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
