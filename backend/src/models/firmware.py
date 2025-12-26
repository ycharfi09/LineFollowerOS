from pydantic import BaseModel
from typing import List, Optional

class SpeedSegment(BaseModel):
    segment_id: str
    base_speed: int
    max_speed: int
    pid_kp: float
    pid_ki: float
    pid_kd: float
    description: str

class FirmwareConfig(BaseModel):
    robot_name: str
    platform: str
    speed_strategy: List[SpeedSegment]
    code: str
