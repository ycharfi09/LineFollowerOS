# Firmware Documentation

## Overview

The firmware templates provide a base implementation for line follower robots that can be customized through the LineFollowerOS web interface.

## Supported Platforms

### Arduino
- Arduino Uno
- Arduino Mega
- Arduino Nano
- Other ATmega-based boards

### Teensy
- Teensy 3.2
- Teensy 3.5/3.6
- Teensy 4.0/4.1

## Code Structure

### LineFollower Class
The main class that encapsulates all robot functionality:

```cpp
LineFollower robot(numSensors, sensorPins, 
                   motorLeftPin1, motorLeftPin2,
                   motorRightPin1, motorRightPin2);
```

### Key Methods

- `begin()`: Initialize hardware (motors, sensors)
- `setPID(kp, ki, kd)`: Configure PID controller
- `setSpeed(base, max)`: Set speed limits
- `readSensors()`: Read sensor values
- `calculatePosition()`: Calculate line position from sensors
- `calculatePID(position)`: Calculate PID correction
- `setMotorSpeeds(left, right)`: Control motor speeds
- `run()`: Main loop - read sensors and adjust motors
- `stop()`: Stop all motors

## PID Controller

The PID controller uses the following formula:
```
correction = (Kp × error) + (Ki × integral) + (Kd × derivative)
```

### Tuning Guide

1. **Start with Kp only** (Ki=0, Kd=0)
   - Increase Kp until robot oscillates
   - Reduce Kp by 20-30%

2. **Add Kd** for damping
   - Increase Kd to reduce oscillation
   - Typical ratio: Kd = Kp / 2

3. **Add Ki if needed** for steady-state error
   - Start with small values (0.001-0.01)
   - Increase gradually if robot drifts

### Typical Values
- **Slow, stable**: Kp=0.5, Ki=0, Kd=0.3
- **Medium**: Kp=1.0, Ki=0, Kd=0.5
- **Fast, aggressive**: Kp=2.0, Ki=0.01, Kd=1.0

## Sensor Configuration

### IR Sensor Array
Default configuration assumes:
- Digital sensors (HIGH = line detected)
- Even spacing across robot width
- Center sensor aligned with robot center

### Position Calculation
Position is calculated as weighted average:
```cpp
position = (sum of sensor_index × 1000) / active_count - center_offset
```

Returns value from -3500 to +3500 for 8 sensors (line position relative to center).

## Motor Control

### PWM Speed Control
Speed values: 0-255
- 0 = stopped
- 255 = maximum speed

### Direction Control
Two pins per motor:
- Forward: Pin1=speed, Pin2=0
- Reverse: Pin1=0, Pin2=speed

## Customization

### Generated Firmware
The web interface generates optimized firmware with:
- Track-specific speed profiles
- Adaptive PID parameters
- Segment-based strategies

### Manual Customization
Edit the following in generated code:
- Pin assignments
- Speed limits
- PID values
- Sensor thresholds

## Flashing Instructions

### Using Arduino IDE
1. Open the .ino file
2. Select your board (Tools → Board)
3. Select the port (Tools → Port)
4. Click Upload

### Using PlatformIO
1. Create new project
2. Copy code to src/main.cpp
3. Run `pio run --target upload`

## Troubleshooting

### Robot doesn't follow line
- Check sensor readings (use Serial monitor)
- Verify sensors detect line vs. background
- Adjust PID values

### Robot oscillates
- Reduce Kp
- Increase Kd
- Reduce base speed

### Robot too slow
- Increase base_speed
- Increase max_speed
- Reduce Kp (less aggressive corrections)

### Motors don't work
- Check motor connections
- Verify motor driver power supply
- Test with simple motor test sketch
