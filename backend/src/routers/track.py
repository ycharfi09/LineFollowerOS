from fastapi import APIRouter, HTTPException
from ..models.track import Track, TrackGraph
from ..services.track_service import TrackService

router = APIRouter()

@router.post("/analyze", response_model=dict)
async def analyze_track(track: Track):
    """Analyze track and return statistics"""
    try:
        analysis = TrackService.analyze_track(track)
        return analysis
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/to-graph", response_model=TrackGraph)
async def convert_to_graph(track: Track):
    """Convert track to graph representation"""
    try:
        graph = TrackService.track_to_graph(track)
        return graph
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/validate")
async def validate_track(track: Track):
    """Validate track has a valid path from start to end"""
    try:
        graph = TrackService.track_to_graph(track)
        return {
            "valid": graph.valid_path is not None,
            "path": graph.valid_path,
            "message": "Valid path found" if graph.valid_path else "No valid path from start to end"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
