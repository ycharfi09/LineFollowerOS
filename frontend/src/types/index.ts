// Type definitions for LineFollowerOS

export enum ElementType {
  START = "start",
  END = "end",
  STRAIGHT = "straight",
  CURVE = "curve",
  FORK = "fork",
  FORBIDDEN_PATH = "forbidden_path",
  LOOP = "loop",
  COLOR_ZONE = "color_zone",
  OBSTACLE = "obstacle"
}

export interface Point {
  x: number;
  y: number;
}

export interface TrackElement {
  id: string;
  type: ElementType;
  position: Point;
  rotation: number;
  width: number;
  length?: number;
  radius?: number;
  color?: string;
  connections: string[];
}

export interface Track {
  name: string;
  elements: TrackElement[];
  width: number;
  height: number;
}

export interface MotorConfig {
  type: string;
  max_rpm: number;
  pins: number[];
}

export interface WheelConfig {
  diameter: number;
  width: number;
}

export interface SensorConfig {
  type: string;
  count: number;
  spacing: number;
  pins: number[];
}

export interface PIDConfig {
  kp: number;
  ki: number;
  kd: number;
}

export interface RobotConfig {
  name: string;
  motor_left: MotorConfig;
  motor_right: MotorConfig;
  wheels: WheelConfig;
  sensors: SensorConfig;
  pid: PIDConfig;
  base_speed: number;
  max_speed: number;
  platform: "arduino" | "teensy";
}

export interface SpeedSegment {
  segment_id: string;
  base_speed: number;
  max_speed: number;
  pid_kp: number;
  pid_ki: number;
  pid_kd: number;
  description: string;
}

export interface FirmwareConfig {
  robot_name: string;
  platform: string;
  speed_strategy: SpeedSegment[];
  code: string;
}
