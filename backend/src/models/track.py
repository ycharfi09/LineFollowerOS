from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict
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
    PATH = "path"  # SVG path
    AREA_MARKER = "area_marker"  # Custom area marker

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
    path_data: Optional[str] = None  # SVG path data
    points: List[Point] = Field(default_factory=list)  # For polygons and custom shapes
    label: Optional[str] = None  # For area markers

class Track(BaseModel):
    name: str
    elements: List[TrackElement]
    width: int = 800
    height: int = 600
    svg_import: Optional[str] = None  # Store original SVG if imported
    
class TrackGraph(BaseModel):
    nodes: List[dict]
    edges: List[dict]
    valid_path: Optional[List[str]] = None
