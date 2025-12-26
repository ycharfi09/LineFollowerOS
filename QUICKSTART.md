# Quick Start Guide

Get LineFollowerOS up and running in 5 minutes!

## Prerequisites

- Node.js 14+ and npm
- Python 3.8+
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ycharfi09/LineFollowerOS.git
cd LineFollowerOS
```

### 2. Install All Dependencies
```bash
npm run install:all
```

This will install both frontend (Node.js) and backend (Python) dependencies.

## Running the Application

### Option 1: Run Everything Together (Recommended)
```bash
npm run dev
```

This starts both backend and frontend servers concurrently.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run frontend
```

### Option 3: Using Docker
```bash
docker-compose up
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## First Steps

### 1. Design Your Track (Track Tab)
1. Click on the "Track 🏁" tab
2. Select a track element from the toolbar (e.g., "start")
3. Click on the canvas to place it
4. Add more elements: straight, curve, fork, etc.
5. Connect elements by adding their IDs to connections

**Tip**: Start with a simple path: Start → Straight → End

### 2. Configure Your Robot (Robot Tab)
1. Click on the "Robot 🤖" tab
2. Enter your robot name
3. Configure motors (default pins work for most Arduino setups)
4. Set wheel dimensions
5. Configure sensors (8 IR sensors is typical)
6. Tune PID values (start with defaults: Kp=1.0, Ki=0.0, Kd=0.5)
7. Set speed limits

### 3. Generate Firmware (Firmware Tab)
1. Click on the "Firmware ⚙️" tab
2. Click "Generate Firmware"
3. Review the generated code
4. Click "Download .ino" to save the firmware
5. Open in Arduino IDE or PlatformIO
6. Flash to your robot!

## Example Workflow

Try the included examples:

```bash
# Use the simple oval track example
# (In the web UI, you can manually recreate the track from examples/simple_oval_track.json)

# Configure robot with "Speed Demon" settings
# (Refer to examples/robot_speed_demon.json)

# Generate and download firmware
# Flash to your Arduino
```

## Testing Without Hardware

You can use the application without physical hardware:
1. Design tracks and experiment with layouts
2. Configure virtual robots with different settings
3. Generate firmware and review the code
4. Learn about PID tuning and speed strategies

## Common Issues

### Backend won't start
```bash
cd backend
pip install -r requirements.txt
```

### Frontend won't start
```bash
cd frontend
npm install
```

### CORS errors
Make sure backend is running on port 8000 and frontend on port 3000.

### Port already in use
Kill the process using the port:
```bash
# Linux/Mac
lsof -ti:8000 | xargs kill
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## Next Steps

1. Read the [README.md](README.md) for detailed documentation
2. Check out [examples/](examples/) for sample configurations
3. Review [firmware/README.md](firmware/README.md) for PID tuning tips
4. Explore the API at http://localhost:8000/docs

## Getting Help

- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub for bugs or feature requests
- Review existing issues for solutions

## Happy Building! 🚀

Now you're ready to build and program your competition line follower robot!
