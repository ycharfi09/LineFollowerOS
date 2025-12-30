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
  OBSTACLE = "obstacle",
  PATH = "path",
  AREA_MARKER = "area_marker"
}

export enum LineType {
  NORMAL = "normal",
  START = "start",
  END = "end",
  FORBIDDEN = "forbidden",
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
  path_data?: string;
  points?: Point[];
  label?: string;
  lineType?: LineType;
  lineWidth?: number;
}

export interface Track {
  name: string;
  elements: TrackElement[];
  width: number;
  height: number;
  svg_import?: string;
}

export interface MotorConfig {
  type: string;
  max_rpm: number;
  pins: number[];
  enable_pin?: number;
  position: string;
}

export interface MotorDriverConfig {
  type: string;
  pins: number[];
  enable_pins: number[];
}

export interface EncoderConfig {
  type: string;
  pin_a: number;
  pin_b: number;
  motor_index: number;
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

export interface UltrasonicConfig {
  trigger_pin: number;
  echo_pin: number;
  position: string;
}

export interface ColorSensorConfig {
  type: string;
  sda_pin: number;
  scl_pin: number;
}

export interface DisplayConfig {
  type: string;
  model: string;
  sda_pin?: number;
  scl_pin?: number;
  width: number;
  height: number;
}

export interface PIDConfig {
  kp: number;
  ki: number;
  kd: number;
}

export interface RobotConfig {
  name: string;
  mcu_board: string;
  motors: MotorConfig[];
  motor_driver?: MotorDriverConfig;
  encoders: EncoderConfig[];
  wheels: WheelConfig;
  sensors: SensorConfig;
  ultrasonics: UltrasonicConfig[];
  color_sensors: ColorSensorConfig[];
  displays: DisplayConfig[];
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
