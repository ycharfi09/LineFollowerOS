# Backend API Documentation

## Overview

The LineFollowerOS backend is built with FastAPI and provides REST APIs for:
- Track analysis and validation
- Robot configuration validation
- Firmware generation with optimized speed strategies

## Architecture

### Models
- **Track Models** (`models/track.py`): Define track elements, positions, and graph structures
- **Robot Models** (`models/robot.py`): Define motor, wheel, sensor, and PID configurations
- **Firmware Models** (`models/firmware.py`): Define speed segments and firmware output

### Services
- **TrackService** (`services/track_service.py`): 
  - Converts tracks to directed graphs using NetworkX
  - Finds valid paths avoiding forbidden segments
  - Analyzes track complexity
  
- **FirmwareService** (`services/firmware_service.py`):
  - Generates segment-based speed strategies
  - Adapts PID parameters based on track elements
  - Creates C++ firmware code from templates

### Routers
- **Track Router** (`routers/track.py`): Track analysis and validation endpoints
- **Robot Router** (`routers/robot.py`): Robot configuration endpoints
- **Firmware Router** (`routers/firmware.py`): Firmware generation endpoints

## Running Tests

```bash
cd backend
pytest
```

## API Examples

### Analyze a Track
```python
import requests

track = {
    "name": "Test Track",
    "elements": [
        {
            "id": "start-1",
            "type": "start",
            "position": {"x": 100, "y": 100},
            "rotation": 0,
            "width": 50,
            "connections": ["straight-1"]
        },
        # ... more elements
    ],
    "width": 800,
    "height": 600
}

response = requests.post("http://localhost:8000/api/track/analyze", json=track)
print(response.json())
```

### Generate Firmware
```python
response = requests.post(
    "http://localhost:8000/api/firmware/generate",
    params={"track": track, "robot": robot_config}
)
firmware = response.json()
print(firmware["code"])
```

## Algorithm Details

### Path Finding
The track-to-graph conversion uses NetworkX's shortest path algorithm:
1. Convert track elements to graph nodes
2. Create edges based on element connections
3. Remove forbidden path nodes
4. Find shortest path from start to end using Dijkstra's algorithm

### Speed Strategy Generation
For each segment in the valid path:
- **Straight segments**: Use full speed
- **Curves**: Reduce speed by 30%, increase Kp by 20%
- **Forks**: Reduce speed by 40%, increase Kp by 50%
- **Obstacles**: Reduce speed by 50%

This creates an optimized speed profile that adapts to track complexity.
