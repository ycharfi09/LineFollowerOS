from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict

class MotorConfig(BaseModel):
    type: str = "DC"  # DC, Stepper, Servo
    max_rpm: int = 200
    pins: List[int] = Field(default_factory=lambda: [9, 10])
    enable_pin: Optional[int] = None
    position: str = "left"  # left, right, front, back, custom

class MotorDriverConfig(BaseModel):
    type: str = "L298N"  # L298N, L293D, TB6612, DRV8833
    pins: List[int] = Field(default_factory=lambda: [])
    enable_pins: List[int] = Field(default_factory=lambda: [])

class EncoderConfig(BaseModel):
    type: str = "optical"  # optical, magnetic
    pin_a: int
    pin_b: int
    motor_index: int = 0  # which motor this encoder is attached to

class WheelConfig(BaseModel):
    diameter: float = 65.0  # mm
    width: float = 20.0  # mm
    
class SensorConfig(BaseModel):
    type: str = "IR"  # IR, Color, Ultrasonic, TCRT5000, QTR, QTRX
    count: int = 8
    spacing: float = 10.0  # mm
    pins: List[int] = Field(default_factory=lambda: [0, 1, 2, 3, 4, 5, 6, 7])

class UltrasonicConfig(BaseModel):
    trigger_pin: int
    echo_pin: int
    position: str = "front"  # front, back, left, right

class ColorSensorConfig(BaseModel):
    type: str = "TCS34725"
    sda_pin: int = 20
    scl_pin: int = 21

class DisplayConfig(BaseModel):
    type: str = "OLED"  # OLED, LCD
    model: str = "SSD1306"  # SSD1306, 16x2, 20x4
    sda_pin: Optional[int] = 20
    scl_pin: Optional[int] = 21
    width: int = 128
    height: int = 64

class PIDConfig(BaseModel):
    kp: float = 1.0
    ki: float = 0.0
    kd: float = 0.5
    
class RobotConfig(BaseModel):
    name: str
    mcu_board: str = "Arduino Uno"  # Arduino Uno, Mega, Nano, Leonardo, Due, Teensy 3.2, 3.5, 3.6, 4.0, 4.1
    motors: List[MotorConfig] = Field(default_factory=lambda: [
        MotorConfig(position="left", pins=[9, 10]),
        MotorConfig(position="right", pins=[5, 6])
    ])
    motor_driver: Optional[MotorDriverConfig] = None
    encoders: List[EncoderConfig] = Field(default_factory=list)
    wheels: WheelConfig = Field(default_factory=WheelConfig)
    sensors: SensorConfig = Field(default_factory=SensorConfig)
    ultrasonics: List[UltrasonicConfig] = Field(default_factory=list)
    color_sensors: List[ColorSensorConfig] = Field(default_factory=list)
    displays: List[DisplayConfig] = Field(default_factory=list)
    pid: PIDConfig = Field(default_factory=PIDConfig)
    base_speed: int = 150  # 0-255
    max_speed: int = 200  # 0-255
    platform: Literal["arduino", "teensy"] = "arduino"
