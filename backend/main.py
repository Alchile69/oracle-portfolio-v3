"""
Oracle Portfolio WOW V1 Backend - FastAPI Application
Phase 5: Backtesting Integration
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from datetime import datetime
import os

# Import routers
from routers import backtesting

# Import Firebase configuration
from firebase_config import db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Oracle Portfolio WOW V1 Backend",
    description="Backend API for Oracle Portfolio V3 with WOW V1 MVP - Phase 5 Backtesting Integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "https://oracle-portfolio-v3.vercel.app",  # Production frontend
        "https://*.vercel.app",  # Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(backtesting.router)

@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "Oracle Portfolio WOW V1 Backend",
        "version": "1.0.0",
        "phase": "Phase 5 - Backtesting Integration",
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "backtesting": "/api/backtest"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "backtesting": "operational",
            "data_apis": "operational"
        }
    }

@app.get("/api/info")
async def api_info():
    """API information and capabilities"""
    return {
        "name": "Oracle Portfolio WOW V1 Backend",
        "version": "1.0.0",
        "phase": "Phase 5 - Backtesting Integration",
        "capabilities": [
            "Historical data fetching (FMP, Alpha Vantage, Yahoo, FRED)",
            "Multiple trading strategies (SMA, RSI, Bollinger Bands, Buy & Hold)",
            "Portfolio backtesting with rebalancing",
            "Benchmark comparison",
            "Risk metrics calculation",
            "Async processing for large backtests"
        ],
        "data_sources": [
            "Financial Modeling Prep (FMP)",
            "Alpha Vantage",
            "Yahoo Finance",
            "FRED (Federal Reserve Economic Data)"
        ],
        "supported_strategies": [
            {
                "id": "buy_and_hold",
                "name": "Buy and Hold",
                "description": "Simple buy and hold strategy"
            },
            {
                "id": "sma_crossover",
                "name": "SMA Crossover",
                "description": "Simple Moving Average crossover strategy"
            },
            {
                "id": "rsi_oversold",
                "name": "RSI Strategy",
                "description": "RSI-based oversold/overbought strategy"
            },
            {
                "id": "bollinger_bands",
                "name": "Bollinger Bands",
                "description": "Mean reversion using Bollinger Bands"
            }
        ]
    }

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "status_code": 500,
            "timestamp": datetime.now().isoformat()
        }
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    """Application startup"""
    logger.info("🚀 Oracle Portfolio WOW V1 Backend starting up...")
    logger.info("📊 Phase 5 - Backtesting Integration")
    logger.info("🔗 APIs configured: FMP, Alpha Vantage, Yahoo, FRED")
    logger.info("⚡ FastAPI server ready")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown"""
    logger.info("🛑 Oracle Portfolio WOW V1 Backend shutting down...")

if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment or default to 8000
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )

