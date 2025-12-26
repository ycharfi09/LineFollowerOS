from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import track, robot, firmware

app = FastAPI(
    title="LineFollowerOS API",
    description="Backend API for LineFollowerOS - A firmware generator for line follower robots",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(track.router, prefix="/api/track", tags=["track"])
app.include_router(robot.router, prefix="/api/robot", tags=["robot"])
app.include_router(firmware.router, prefix="/api/firmware", tags=["firmware"])

@app.get("/")
async def root():
    return {
        "message": "LineFollowerOS API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
