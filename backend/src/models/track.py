from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from enum import Enum

class ElementType(str, Enum):
    START = "start"
    END = "end"
    STRAIGHT = "straight"
    CURVE = "curve"
    FORK = "fork"
    FORBIDDEN_PATH = "forbidden_path"
    LOOP = "loop"
    COLOR_ZONE = "color_zone"
    OBSTACLE = "obstacle"

class Point(BaseModel):
    x: float
    y: float

class TrackElement(BaseModel):
    id: str
    type: ElementType
    position: Point
    rotation: float = 0.0
    width: float = 50.0
    length: Optional[float] = None
    radius: Optional[float] = None
    color: Optional[str] = None
    connections: List[str] = Field(default_factory=list)

class Track(BaseModel):
    name: str
    elements: List[TrackElement]
    width: int = 800
    height: int = 600
    
class TrackGraph(BaseModel):
    nodes: List[dict]
    edges: List[dict]
    valid_path: Optional[List[str]] = None
