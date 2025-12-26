# Changelog

All notable changes to LineFollowerOS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-26

### Added
- Initial release of LineFollowerOS monorepo
- Frontend: React + TypeScript canvas-based track editor
  - Support for multiple track elements (start, end, straight, curve, fork, forbidden path, loop, color zone, obstacle)
  - Interactive track element placement and editing
  - Track validation with visual feedback
- Frontend: Robot builder UI
  - Motor configuration (type, RPM, pins)
  - Wheel specifications (diameter, width)
  - Sensor array setup (type, count, spacing, pins)
  - PID controller tuning interface
  - Speed settings configuration
  - Platform selection (Arduino/Teensy)
- Frontend: Firmware generator
  - One-click firmware generation
  - Code preview
  - Download as .ino file
- Backend: FastAPI REST API
  - Track analysis endpoint (statistics, validation)
  - Track to graph conversion using NetworkX
  - Valid path finding algorithm (avoiding forbidden paths)
  - Robot configuration validation
  - Firmware generation with segment-based speed strategies
  - Adaptive PID parameter adjustment based on track elements
- Backend: Path solving algorithm
  - Dijkstra's shortest path
  - Forbidden path avoidance
  - Start to end validation
- Firmware: Arduino/Teensy templates
  - LineFollower C++ class
  - PID controller with anti-windup
  - Motor control (PWM-based)
  - Sensor array reading (IR sensors)
  - Position calculation from sensor array
  - Example sketches
- Documentation
  - Comprehensive README with setup instructions
  - Backend API documentation
  - Firmware documentation with PID tuning guide
  - Example configurations (tracks and robots)
  - Contributing guidelines
- Infrastructure
  - Monorepo structure with workspace support
  - Docker Compose setup for easy deployment
  - Development scripts (concurrent frontend/backend)
  - Environment configuration examples
  - MIT License

### Technical Details
- Frontend built with Create React App, TypeScript 4.x
- Backend built with FastAPI 0.109.0, Python 3.8+
- Firmware compatible with Arduino and Teensy platforms
- Graph algorithms powered by NetworkX
- CORS configuration for local development
- REST API with automatic OpenAPI documentation

## [Unreleased]

### Planned Features
- Track import/export functionality
- Robot configuration presets library
- Real-time firmware simulation
- Mobile-responsive UI
- Multi-language support
- ESP32 platform support
- Advanced PID autotuning
- Track complexity analyzer
- Competition mode timers
