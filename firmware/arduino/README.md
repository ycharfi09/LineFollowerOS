# Arduino Firmware for LineFollowerOS

This directory contains the base Arduino firmware template for line follower robots.

## Files

- `LineFollower.h` - Header file with class definition
- `LineFollower.cpp` - Implementation of the LineFollower class
- `example.ino` - Example Arduino sketch

## Usage

1. Use the LineFollowerOS web interface to generate custom firmware
2. Or manually edit `example.ino` with your robot's configuration
3. Upload to your Arduino board using Arduino IDE or PlatformIO

## Hardware Requirements

- Arduino Uno/Mega or compatible board
- IR sensor array (recommended: 8 sensors)
- Motor driver (L298N, L293D, or similar)
- DC motors (2x)
- Power supply (7-12V for Arduino, separate for motors recommended)

## Pin Configuration

Default pins (can be customized):
- Sensors: A0-A7
- Left Motor: Pins 9, 10
- Right Motor: Pins 5, 6

## PID Tuning

Start with:
- Kp = 1.0
- Ki = 0.0
- Kd = 0.5

Adjust based on performance:
- Increase Kp for faster response
- Add Ki to eliminate steady-state error
- Increase Kd to reduce oscillation
