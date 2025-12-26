# Teensy Firmware for LineFollowerOS

This directory contains the base Teensy firmware template for line follower robots.

## Differences from Arduino

Teensy boards offer:
- Higher clock speeds (up to 600 MHz on Teensy 4.x)
- More PWM pins
- Better analog resolution
- Floating-point math acceleration

## Usage

1. Use the LineFollowerOS web interface to generate custom firmware
2. The generated code is compatible with Teensy 3.x and 4.x
3. Upload using Teensy Loader or Arduino IDE with Teensyduino

## Notes

The base implementation is similar to Arduino but can be optimized for Teensy's capabilities.
Use the web interface to generate platform-specific optimizations.
