from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class MotorConfig(BaseModel):
    type: str = "DC"  # DC, Stepper, Servo
    max_rpm: int = 200
    pins: List[int] = Field(default_factory=lambda: [9, 10])

class WheelConfig(BaseModel):
    diameter: float = 65.0  # mm
    width: float = 20.0  # mm
    
class SensorConfig(BaseModel):
    type: str = "IR"  # IR, Color, Ultrasonic
    count: int = 8
    spacing: float = 10.0  # mm
    pins: List[int] = Field(default_factory=lambda: [A0, A1, A2, A3, A4, A5, A6, A7])

class PIDConfig(BaseModel):
    kp: float = 1.0
    ki: float = 0.0
    kd: float = 0.5
    
class RobotConfig(BaseModel):
    name: str
    motor_left: MotorConfig = Field(default_factory=MotorConfig)
    motor_right: MotorConfig = Field(default_factory=MotorConfig)
    wheels: WheelConfig = Field(default_factory=WheelConfig)
    sensors: SensorConfig = Field(default_factory=SensorConfig)
    pid: PIDConfig = Field(default_factory=PIDConfig)
    base_speed: int = 150  # 0-255
    max_speed: int = 200  # 0-255
    platform: Literal["arduino", "teensy"] = "arduino"
