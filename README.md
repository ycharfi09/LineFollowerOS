# LineFollowerOS (LFOS)

A comprehensive web-based track & robot builder that generates ready-to-flash firmware for competition line follower robots.

![LineFollowerOS](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Overview

LineFollowerOS is a monorepo containing three main components:

1. **Frontend**: React + TypeScript canvas editor for designing tracks and configuring robots
2. **Backend**: Python FastAPI for track analysis, path solving, and firmware generation
3. **Firmware**: C++ templates for Arduino and Teensy platforms

## Features

### 🏁 Track Editor
- Interactive canvas-based track designer
- Support for multiple track elements:
  - Start/End points
  - Straight segments
  - Curves
  - Forks (decision points)
  - Forbidden paths
  - Loops
  - Color zones
  - Obstacles
- Real-time validation of track paths

### 🤖 Robot Builder
- Configure motors (DC, Stepper, Servo)
- Define wheel specifications (diameter, width)
- Set up sensor arrays (IR, Color, Ultrasonic)
- Customize PID controller parameters
- Adjust speed settings
- Support for Arduino and Teensy platforms

### ⚙️ Firmware Generator
- Automatic conversion of tracks to graphs
- Path-finding algorithm (avoiding forbidden paths)
- Segment-based speed strategy generation
- Adaptive PID tuning for different track sections
- Ready-to-flash C++ code generation
- Download firmware as .ino files

## Project Structure

```
LineFollowerOS/
├── frontend/               # React + TypeScript application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── TrackEditor.tsx
│   │   │   ├── RobotBuilder.tsx
│   │   │   └── FirmwareGenerator.tsx
│   │   ├── types/         # TypeScript type definitions
│   │   ├── services/      # API service layer
│   │   └── App.tsx        # Main application component
│   └── package.json
├── backend/               # Python FastAPI application
│   ├── src/
│   │   ├── main.py       # FastAPI application entry point
│   │   ├── models/       # Pydantic models
│   │   │   ├── track.py
│   │   │   ├── robot.py
│   │   │   └── firmware.py
│   │   ├── services/     # Business logic
│   │   │   ├── track_service.py
│   │   │   └── firmware_service.py
│   │   └── routers/      # API endpoints
│   │       ├── track.py
│   │       ├── robot.py
│   │       └── firmware.py
│   └── requirements.txt
├── firmware/             # C++ firmware templates
│   ├── arduino/         # Arduino-specific code
│   │   ├── LineFollower.h
│   │   ├── LineFollower.cpp
│   │   └── example.ino
│   └── teensy/          # Teensy-specific code
├── package.json         # Root package.json for monorepo
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 14+ and npm
- Python 3.8+
- Arduino IDE or PlatformIO (for flashing firmware)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ycharfi09/LineFollowerOS.git
cd LineFollowerOS
```

2. Install all dependencies:
```bash
npm run install:all
```

Or install individually:

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

### Running the Application

#### Development Mode (Both Frontend and Backend)
```bash
npm run dev
```

#### Run Separately

**Backend:**
```bash
npm run backend
# Or manually:
cd backend
python -m uvicorn src.main:app --reload
```

**Frontend:**
```bash
npm run frontend
# Or manually:
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:8000`.

## Usage

### 1. Design Your Track
- Click on the **Track** tab
- Select track elements from the toolbar
- Click on the canvas to place elements
- Configure element properties (position, rotation, connections)
- Validate that there's a valid path from start to end

### 2. Configure Your Robot
- Click on the **Robot** tab
- Set up motor specifications
- Configure wheel dimensions
- Define sensor array (type, count, spacing)
- Tune PID parameters (Kp, Ki, Kd)
- Set speed limits (base speed, max speed)
- Choose platform (Arduino or Teensy)

### 3. Generate Firmware
- Click on the **Firmware** tab
- Click "Generate Firmware"
- Review the generated code
- Download the .ino file
- Flash to your Arduino/Teensy board

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Key Endpoints

- `POST /api/track/analyze` - Analyze track and return statistics
- `POST /api/track/to-graph` - Convert track to graph representation
- `POST /api/track/validate` - Validate track has valid path
- `POST /api/robot/validate` - Validate robot configuration
- `POST /api/firmware/generate` - Generate complete firmware
- `POST /api/firmware/generate/code` - Generate firmware code only

## Hardware Requirements

### Recommended Components
- Arduino Uno/Mega or Teensy 3.x/4.x
- IR sensor array (8 sensors recommended)
- Motor driver (L298N, L293D, or similar)
- 2x DC motors with wheels
- 7-12V power supply
- Chassis and mounting hardware

### Wiring
Default pin configuration (customizable via web interface):
- Sensors: A0-A7 (analog pins)
- Left Motor: Pins 9, 10
- Right Motor: Pins 5, 6

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

Built for competition line follower robot enthusiasts and teams looking to optimize their robots with data-driven firmware generation.

## Support

For questions or issues, please open an issue on GitHub or contact the maintainers.
