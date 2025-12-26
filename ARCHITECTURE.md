# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     LineFollowerOS                           │
│                      (Monorepo)                              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Frontend   │      │   Backend    │     │   Firmware   │
│  React + TS  │◄────►│ FastAPI + Py │     │   C++ Code   │
└──────────────┘      └──────────────┘     └──────────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│ - TrackEdit  │      │ Track Service│     │  Arduino/    │
│ - RobotBuild │      │ Firmware Svc │     │  Teensy      │
│ - FW Gen     │      │ Graph Algo   │     │  Templates   │
└──────────────┘      └──────────────┘     └──────────────┘
```

## Component Interaction Flow

### 1. Track Design Flow
```
User → TrackEditor → Canvas API → Track Model → Local State
                                                    │
                                                    ▼
                              [Save/Validate] → Backend API
                                                    │
                                                    ▼
                                        TrackService (Graph Conversion)
                                                    │
                                                    ▼
                                        NetworkX (Path Finding)
                                                    │
                                                    ▼
                                            Valid Path Result
```

### 2. Robot Configuration Flow
```
User → RobotBuilder → Form Inputs → Robot Model → Local State
                                                      │
                                                      ▼
                                    [Validate] → Backend API
                                                      │
                                                      ▼
                                            Validation Result
```

### 3. Firmware Generation Flow
```
Track + Robot → FirmwareGenerator → API Request → Backend
                                                      │
                                                      ▼
                                            FirmwareService
                                                      │
                    ┌─────────────────────────────────┤
                    │                                 │
                    ▼                                 ▼
         Generate Speed Strategy          Generate C++ Code
                    │                                 │
                    └─────────────┬───────────────────┘
                                  │
                                  ▼
                          Firmware Config
                                  │
                                  ▼
                            Response to UI
                                  │
                                  ▼
                        Download .ino File
                                  │
                                  ▼
                        Flash to Hardware
```

## Data Models

### Track Model
```
Track
├── name: string
├── elements: TrackElement[]
│   ├── id: string
│   ├── type: ElementType (enum)
│   ├── position: Point {x, y}
│   ├── rotation: number
│   ├── width: number
│   ├── connections: string[]
│   └── [optional properties]
├── width: number
└── height: number
```

### Robot Model
```
RobotConfig
├── name: string
├── motor_left: MotorConfig
│   ├── type: string
│   ├── max_rpm: number
│   └── pins: number[]
├── motor_right: MotorConfig
├── wheels: WheelConfig
│   ├── diameter: number
│   └── width: number
├── sensors: SensorConfig
│   ├── type: string
│   ├── count: number
│   ├── spacing: number
│   └── pins: number[]
├── pid: PIDConfig
│   ├── kp: number
│   ├── ki: number
│   └── kd: number
├── base_speed: number
├── max_speed: number
└── platform: "arduino" | "teensy"
```

### Firmware Model
```
FirmwareConfig
├── robot_name: string
├── platform: string
├── speed_strategy: SpeedSegment[]
│   ├── segment_id: string
│   ├── base_speed: number
│   ├── max_speed: number
│   ├── pid_kp: number
│   ├── pid_ki: number
│   ├── pid_kd: number
│   └── description: string
└── code: string (C++ code)
```

## API Endpoints

### Track Endpoints
- `POST /api/track/analyze` - Get track statistics
- `POST /api/track/to-graph` - Convert to graph representation
- `POST /api/track/validate` - Validate path existence

### Robot Endpoints
- `POST /api/robot/validate` - Validate configuration
- `POST /api/robot/test` - Get performance estimates

### Firmware Endpoints
- `POST /api/firmware/generate` - Generate complete firmware
- `POST /api/firmware/generate/code` - Generate code only
- `POST /api/firmware/strategy` - Generate speed strategy

## Algorithms

### Path Finding Algorithm
1. Convert track elements to directed graph (NetworkX)
2. Create nodes for each element
3. Create edges based on connections
4. Remove forbidden path nodes
5. Use Dijkstra's algorithm to find shortest path from start to end
6. Return valid path or null if no path exists

### Speed Strategy Algorithm
For each segment in valid path:
1. Start with robot's base speed and PID values
2. Adjust based on element type:
   - **Straight**: Full speed, normal PID
   - **Curve**: 70% speed, 1.2x Kp (more aggressive)
   - **Fork**: 60% speed, 1.5x Kp (very careful)
   - **Obstacle**: 50% speed, normal PID
3. Generate segment-specific configuration
4. Include in firmware as comments/constants

### PID Controller Algorithm (Firmware)
```
error = desired_position - actual_position
integral += error
derivative = error - last_error

correction = (Kp × error) + (Ki × integral) + (Kd × derivative)

left_speed = base_speed + correction
right_speed = base_speed - correction

// Apply constraints
left_speed = constrain(left_speed, 0, max_speed)
right_speed = constrain(right_speed, 0, max_speed)
```

## Technology Stack

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 4.x
- **UI**: Canvas API for track editor
- **HTTP Client**: Axios
- **Build Tool**: Create React App
- **Package Manager**: npm

### Backend
- **Framework**: FastAPI 0.109
- **Language**: Python 3.8+
- **Graph Library**: NetworkX 3.2
- **Validation**: Pydantic 2.5
- **Server**: Uvicorn
- **Package Manager**: pip

### Firmware
- **Language**: C++
- **Platforms**: Arduino, Teensy
- **Libraries**: Standard Arduino libraries
- **Build Tools**: Arduino IDE, PlatformIO

### DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions
- **Version Control**: Git
- **Monorepo**: npm workspaces

## Deployment Options

### Development
```bash
npm run dev  # Runs both frontend and backend
```

### Production with Docker
```bash
docker-compose up -d
```

### Cloud Deployment
- Frontend: Static hosting (Netlify, Vercel, GitHub Pages)
- Backend: Container hosting (AWS ECS, Google Cloud Run, DigitalOcean)
- Database: Not required (stateless API)

## Performance Considerations

### Frontend
- Canvas rendering optimized for <1000 elements
- Debounced API calls for real-time validation
- Lazy loading of components

### Backend
- Stateless API design
- Efficient graph algorithms (O(n log n))
- No database required (all computation on-demand)
- Fast response times (<100ms typical)

### Firmware
- Optimized for microcontroller constraints
- Minimal memory footprint
- Fast sensor reading (sub-millisecond)
- Real-time PID control loop

## Security

- CORS configured for trusted origins
- No authentication required (local/personal use)
- Input validation via Pydantic
- No sensitive data stored
- Safe firmware generation (no code injection)

## Extensibility

### Adding New Track Elements
1. Add to `ElementType` enum (frontend & backend)
2. Update drawing logic in `TrackEditor`
3. Update path finding if needed
4. Update speed strategy logic

### Supporting New Platforms
1. Create new firmware template directory
2. Update `platform` type in models
3. Adjust firmware generation logic
4. Test on target hardware

### Adding New Features
1. Design UI component (frontend)
2. Create API endpoint (backend)
3. Implement business logic (services)
4. Update models as needed
5. Add tests and documentation
