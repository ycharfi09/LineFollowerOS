# LineFollowerOS Examples

This directory contains example configurations for tracks and robots.

## Track Examples

### simple_oval_track.json
A basic oval track with straight segments and curves. Good for initial testing and tuning.

### competition_track.json
A more complex track featuring:
- Fork decision point
- Forbidden path (to avoid)
- Obstacle
- Mix of straight and curved sections

## Robot Examples

### robot_speed_demon.json
High-speed configuration:
- Higher RPM motors (250)
- Aggressive PID tuning (Kp=1.5, Kd=0.8)
- Base speed: 180, Max speed: 220
- 8 sensors with wider spacing

Best for: Fast, simple tracks with gentle curves

### robot_precision.json
Precision configuration:
- Lower RPM motors (150)
- Conservative PID tuning (Kp=0.8, Kd=0.4)
- Base speed: 120, Max speed: 160
- 12 sensors with tight spacing

Best for: Complex tracks with sharp turns and obstacles

## Usage

### Web Interface
These files can be imported into the LineFollowerOS web interface:
1. Go to Track or Robot tab
2. Click "Import" button
3. Select the JSON file

### API
Use these files with the backend API:

```bash
# Analyze a track
curl -X POST http://localhost:8000/api/track/analyze \
  -H "Content-Type: application/json" \
  -d @examples/simple_oval_track.json

# Validate a robot
curl -X POST http://localhost:8000/api/robot/validate \
  -H "Content-Type: application/json" \
  -d @examples/robot_speed_demon.json
```

## Creating Your Own

You can create your own configurations by:
1. Using the web interface and exporting
2. Copying and modifying these examples
3. Following the schema in the backend models

## Tips

- Start with simple tracks to test your robot
- Tune PID values incrementally
- Match sensor count to track complexity
- Consider motor RPM vs. control precision tradeoff
