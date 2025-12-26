# Frontend Documentation

## Overview

The LineFollowerOS frontend is a React + TypeScript application that provides an intuitive interface for designing tracks, configuring robots, and generating firmware.

## Components

### TrackEditor.tsx
Interactive canvas-based track editor with:
- Drag-and-drop element placement
- Multiple track element types (start, end, straight, curve, fork, forbidden path, loop, color zone, obstacle)
- Visual representation of track layout
- Element selection and deletion
- Grid-based alignment

**Props:**
- `elements`: Array of track elements
- `onElementsChange`: Callback for element updates
- `width`: Canvas width
- `height`: Canvas height

### RobotBuilder.tsx
Comprehensive robot configuration interface:
- Motor specifications (type, RPM, pins)
- Wheel dimensions (diameter, width)
- Sensor array setup (type, count, spacing, pins)
- PID controller tuning (Kp, Ki, Kd)
- Speed settings (base speed, max speed)
- Platform selection (Arduino/Teensy)

**Props:**
- `robot`: Robot configuration object
- `onRobotChange`: Callback for robot updates

### FirmwareGenerator.tsx
Firmware generation and download interface:
- One-click firmware generation
- Real-time code preview
- Download as .ino file
- Error handling and validation

**Props:**
- `track`: Track configuration
- `robot`: Robot configuration

## Services

### api.ts
API service layer using axios for backend communication:

**Track API:**
- `analyze(track)`: Get track statistics
- `toGraph(track)`: Convert track to graph
- `validate(track)`: Validate track path

**Robot API:**
- `validate(robot)`: Validate robot configuration
- `test(robot)`: Test robot performance estimates

**Firmware API:**
- `generate(track, robot)`: Generate complete firmware
- `generateCode(track, robot)`: Generate code only
- `generateStrategy(track, robot)`: Generate speed strategy

## Types

### types/index.ts
TypeScript type definitions for:
- Track elements and configurations
- Robot components (motors, wheels, sensors)
- PID configuration
- Firmware output

## State Management

The application uses React hooks for state management:
- `useState` for local component state
- Props drilling for parent-child communication
- No external state management library (simple application)

## Styling

- Inline styles for component-specific styling
- Gradient header for visual appeal
- Responsive button styles
- Canvas-based rendering for track editor

## Development

### Running Locally
```bash
cd frontend
npm start
```

### Building for Production
```bash
cd frontend
npm run build
```

### Running Tests
```bash
cd frontend
npm test
```

## Configuration

### Environment Variables
Create `.env` file (see `.env.example`):
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Future Improvements

- Track import/export
- Undo/redo functionality
- Zoom and pan in track editor
- Robot configuration presets
- Mobile responsiveness
- Dark mode
- Real-time validation feedback
- Multi-language support
