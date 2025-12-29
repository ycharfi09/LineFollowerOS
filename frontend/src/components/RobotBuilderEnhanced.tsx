import React, { useState } from 'react';
import {
  RobotConfig,
  MotorConfig,
  MotorDriverConfig,
  EncoderConfig,
  WheelConfig,
  SensorConfig,
  UltrasonicConfig,
  ColorSensorConfig,
  DisplayConfig,
  PIDConfig
} from '../types';

interface RobotBuilderEnhancedProps {
  robot: RobotConfig;
  onRobotChange: (robot: RobotConfig) => void;
}

const MCU_BOARDS = [
  'Arduino Uno',
  'Arduino Mega',
  'Arduino Nano',
  'Arduino Leonardo',
  'Arduino Due',
  'Teensy 3.2',
  'Teensy 3.5',
  'Teensy 3.6',
  'Teensy 4.0',
  'Teensy 4.1'
];

const MOTOR_DRIVERS = ['L298N', 'L293D', 'TB6612', 'DRV8833', 'None'];
const SENSOR_TYPES = ['IR', 'TCRT5000', 'QTR', 'QTRX', 'Color', 'Ultrasonic'];
const DISPLAY_TYPES = ['OLED', 'LCD'];
const DISPLAY_MODELS = ['SSD1306', '16x2', '20x4'];

const RobotBuilderEnhanced: React.FC<RobotBuilderEnhancedProps> = ({ robot, onRobotChange }) => {
  const [activeSection, setActiveSection] = useState<string>('basic');

  const updateRobot = (updates: Partial<RobotConfig>) => {
    onRobotChange({ ...robot, ...updates });
  };

  const updateMotor = (index: number, updates: Partial<MotorConfig>) => {
    const newMotors = [...robot.motors];
    newMotors[index] = { ...newMotors[index], ...updates };
    updateRobot({ motors: newMotors });
  };

  const addMotor = () => {
    updateRobot({
      motors: [
        ...robot.motors,
        {
          type: 'DC',
          max_rpm: 200,
          pins: [11, 12],
          position: 'custom'
        }
      ]
    });
  };

  const removeMotor = (index: number) => {
    updateRobot({
      motors: robot.motors.filter((_, i) => i !== index)
    });
  };

  const updateMotorDriver = (updates: Partial<MotorDriverConfig>) => {
    updateRobot({
      motor_driver: robot.motor_driver 
        ? { ...robot.motor_driver, ...updates }
        : { type: 'L298N', pins: [], enable_pins: [], ...updates }
    });
  };

  const addEncoder = () => {
    updateRobot({
      encoders: [
        ...robot.encoders,
        {
          type: 'optical',
          pin_a: 2,
          pin_b: 3,
          motor_index: 0
        }
      ]
    });
  };

  const updateEncoder = (index: number, updates: Partial<EncoderConfig>) => {
    const newEncoders = [...robot.encoders];
    newEncoders[index] = { ...newEncoders[index], ...updates };
    updateRobot({ encoders: newEncoders });
  };

  const removeEncoder = (index: number) => {
    updateRobot({
      encoders: robot.encoders.filter((_, i) => i !== index)
    });
  };

  const updateWheels = (updates: Partial<WheelConfig>) => {
    updateRobot({ wheels: { ...robot.wheels, ...updates } });
  };

  const updateSensors = (updates: Partial<SensorConfig>) => {
    updateRobot({ sensors: { ...robot.sensors, ...updates } });
  };

  const addUltrasonic = () => {
    updateRobot({
      ultrasonics: [
        ...robot.ultrasonics,
        {
          trigger_pin: 7,
          echo_pin: 8,
          position: 'front'
        }
      ]
    });
  };

  const updateUltrasonic = (index: number, updates: Partial<UltrasonicConfig>) => {
    const newUltrasonics = [...robot.ultrasonics];
    newUltrasonics[index] = { ...newUltrasonics[index], ...updates };
    updateRobot({ ultrasonics: newUltrasonics });
  };

  const removeUltrasonic = (index: number) => {
    updateRobot({
      ultrasonics: robot.ultrasonics.filter((_, i) => i !== index)
    });
  };

  const addColorSensor = () => {
    updateRobot({
      color_sensors: [
        ...robot.color_sensors,
        {
          type: 'TCS34725',
          sda_pin: 20,
          scl_pin: 21
        }
      ]
    });
  };

  const updateColorSensor = (index: number, updates: Partial<ColorSensorConfig>) => {
    const newColorSensors = [...robot.color_sensors];
    newColorSensors[index] = { ...newColorSensors[index], ...updates };
    updateRobot({ color_sensors: newColorSensors });
  };

  const removeColorSensor = (index: number) => {
    updateRobot({
      color_sensors: robot.color_sensors.filter((_, i) => i !== index)
    });
  };

  const addDisplay = () => {
    updateRobot({
      displays: [
        ...robot.displays,
        {
          type: 'OLED',
          model: 'SSD1306',
          sda_pin: 20,
          scl_pin: 21,
          width: 128,
          height: 64
        }
      ]
    });
  };

  const updateDisplay = (index: number, updates: Partial<DisplayConfig>) => {
    const newDisplays = [...robot.displays];
    newDisplays[index] = { ...newDisplays[index], ...updates };
    updateRobot({ displays: newDisplays });
  };

  const removeDisplay = (index: number) => {
    updateRobot({
      displays: robot.displays.filter((_, i) => i !== index)
    });
  };

  const updatePID = (updates: Partial<PIDConfig>) => {
    updateRobot({ pid: { ...robot.pid, ...updates } });
  };

  const renderBasicInfo = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Robot Name:
        </label>
        <input
          type="text"
          value={robot.name}
          onChange={e => updateRobot({ name: e.target.value })}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          MCU Board:
        </label>
        <select
          value={robot.mcu_board}
          onChange={e => updateRobot({ mcu_board: e.target.value })}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          {MCU_BOARDS.map(board => (
            <option key={board} value={board}>{board}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Platform:
        </label>
        <select
          value={robot.platform}
          onChange={e => updateRobot({ platform: e.target.value as 'arduino' | 'teensy' })}
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="arduino">Arduino</option>
          <option value="teensy">Teensy</option>
        </select>
      </div>
    </div>
  );

  const renderMotors = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Motors ({robot.motors.length})</h3>
        <button
          onClick={addMotor}
          style={{
            padding: '6px 12px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Add Motor
        </button>
      </div>

      {robot.motors.map((motor, index) => (
        <div key={index} style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          padding: '10px', 
          marginBottom: '10px',
          background: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Motor {index + 1} ({motor.position})</h4>
            {robot.motors.length > 2 && (
              <button
                onClick={() => removeMotor(index)}
                style={{
                  padding: '4px 8px',
                  background: '#F44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Remove
              </button>
            )}
          </div>

          <label>Position:</label>
          <select
            value={motor.position}
            onChange={e => updateMotor(index, { position: e.target.value })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="front">Front</option>
            <option value="back">Back</option>
            <option value="custom">Custom</option>
          </select>

          <label>Type:</label>
          <select
            value={motor.type}
            onChange={e => updateMotor(index, { type: e.target.value })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          >
            <option value="DC">DC Motor</option>
            <option value="Stepper">Stepper Motor</option>
            <option value="Servo">Servo Motor</option>
          </select>

          <label>Max RPM:</label>
          <input
            type="number"
            value={motor.max_rpm}
            onChange={e => updateMotor(index, { max_rpm: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          />

          <label>Control Pins (comma-separated):</label>
          <input
            type="text"
            value={motor.pins.join(', ')}
            onChange={e => updateMotor(index, { 
              pins: e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
            })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
            placeholder="e.g., 9, 10"
          />

          <label>Enable Pin (optional):</label>
          <input
            type="number"
            value={motor.enable_pin || ''}
            onChange={e => updateMotor(index, { enable_pin: parseInt(e.target.value) || undefined })}
            style={{ width: '100%', padding: '4px' }}
            placeholder="Leave empty if not used"
          />
        </div>
      ))}

      <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', background: '#f9f9f9' }}>
        <h4>Motor Driver</h4>
        <label>Type:</label>
        <select
          value={robot.motor_driver?.type || 'None'}
          onChange={e => {
            if (e.target.value === 'None') {
              updateRobot({ motor_driver: undefined });
            } else {
              updateMotorDriver({ type: e.target.value });
            }
          }}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        >
          {MOTOR_DRIVERS.map(driver => (
            <option key={driver} value={driver}>{driver}</option>
          ))}
        </select>

        {robot.motor_driver && (
          <>
            <label>Driver Control Pins (comma-separated):</label>
            <input
              type="text"
              value={robot.motor_driver.pins.join(', ')}
              onChange={e => updateMotorDriver({ 
                pins: e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
              })}
              style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
              placeholder="e.g., 4, 7"
            />

            <label>Enable Pins (comma-separated):</label>
            <input
              type="text"
              value={robot.motor_driver.enable_pins.join(', ')}
              onChange={e => updateMotorDriver({ 
                enable_pins: e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
              })}
              style={{ width: '100%', padding: '4px' }}
              placeholder="e.g., 5, 6"
            />
          </>
        )}
      </div>
    </div>
  );

  const renderEncoders = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Encoders ({robot.encoders.length})</h3>
        <button
          onClick={addEncoder}
          style={{
            padding: '6px 12px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Add Encoder
        </button>
      </div>

      {robot.encoders.length === 0 && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No encoders configured. Click "Add Encoder" to add one.</p>
      )}

      {robot.encoders.map((encoder, index) => (
        <div key={index} style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          padding: '10px', 
          marginBottom: '10px',
          background: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Encoder {index + 1}</h4>
            <button
              onClick={() => removeEncoder(index)}
              style={{
                padding: '4px 8px',
                background: '#F44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>

          <label>Type:</label>
          <select
            value={encoder.type}
            onChange={e => updateEncoder(index, { type: e.target.value })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          >
            <option value="optical">Optical</option>
            <option value="magnetic">Magnetic</option>
          </select>

          <label>Motor Index:</label>
          <select
            value={encoder.motor_index}
            onChange={e => updateEncoder(index, { motor_index: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          >
            {robot.motors.map((motor, i) => (
              <option key={i} value={i}>Motor {i + 1} ({motor.position})</option>
            ))}
          </select>

          <label>Pin A:</label>
          <input
            type="number"
            value={encoder.pin_a}
            onChange={e => updateEncoder(index, { pin_a: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          />

          <label>Pin B:</label>
          <input
            type="number"
            value={encoder.pin_b}
            onChange={e => updateEncoder(index, { pin_b: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px' }}
          />
        </div>
      ))}
    </div>
  );

  const renderSensors = () => (
    <div>
      <h3>Line Following Sensors</h3>
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', background: '#f9f9f9' }}>
        <label>Sensor Type:</label>
        <select
          value={robot.sensors.type}
          onChange={e => updateSensors({ type: e.target.value })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        >
          {SENSOR_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <label>Count:</label>
        <input
          type="number"
          value={robot.sensors.count}
          onChange={e => updateSensors({ count: parseInt(e.target.value) })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        />

        <label>Spacing (mm):</label>
        <input
          type="number"
          value={robot.sensors.spacing}
          onChange={e => updateSensors({ spacing: parseFloat(e.target.value) })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        />

        <label>Analog Pins (comma-separated):</label>
        <input
          type="text"
          value={robot.sensors.pins.join(', ')}
          onChange={e => updateSensors({ 
            pins: e.target.value.split(',').map(p => parseInt(p.trim())).filter(p => !isNaN(p))
          })}
          style={{ width: '100%', padding: '4px' }}
          placeholder="e.g., 0, 1, 2, 3, 4, 5, 6, 7"
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Ultrasonic Sensors ({robot.ultrasonics.length})</h3>
        <button
          onClick={addUltrasonic}
          style={{
            padding: '6px 12px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Add Ultrasonic
        </button>
      </div>

      {robot.ultrasonics.map((ultrasonic, index) => (
        <div key={index} style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          padding: '10px', 
          marginBottom: '10px',
          background: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Ultrasonic {index + 1} ({ultrasonic.position})</h4>
            <button
              onClick={() => removeUltrasonic(index)}
              style={{
                padding: '4px 8px',
                background: '#F44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>

          <label>Position:</label>
          <select
            value={ultrasonic.position}
            onChange={e => updateUltrasonic(index, { position: e.target.value })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          >
            <option value="front">Front</option>
            <option value="back">Back</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>

          <label>Trigger Pin:</label>
          <input
            type="number"
            value={ultrasonic.trigger_pin}
            onChange={e => updateUltrasonic(index, { trigger_pin: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          />

          <label>Echo Pin:</label>
          <input
            type="number"
            value={ultrasonic.echo_pin}
            onChange={e => updateUltrasonic(index, { echo_pin: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px' }}
          />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Color Sensors ({robot.color_sensors.length})</h3>
        <button
          onClick={addColorSensor}
          style={{
            padding: '6px 12px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Add Color Sensor
        </button>
      </div>

      {robot.color_sensors.map((colorSensor, index) => (
        <div key={index} style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          padding: '10px', 
          marginBottom: '10px',
          background: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Color Sensor {index + 1}</h4>
            <button
              onClick={() => removeColorSensor(index)}
              style={{
                padding: '4px 8px',
                background: '#F44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>

          <label>Type:</label>
          <input
            type="text"
            value={colorSensor.type}
            onChange={e => updateColorSensor(index, { type: e.target.value })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          />

          <label>SDA Pin (I2C):</label>
          <input
            type="number"
            value={colorSensor.sda_pin}
            onChange={e => updateColorSensor(index, { sda_pin: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          />

          <label>SCL Pin (I2C):</label>
          <input
            type="number"
            value={colorSensor.scl_pin}
            onChange={e => updateColorSensor(index, { scl_pin: parseInt(e.target.value) })}
            style={{ width: '100%', padding: '4px' }}
          />
        </div>
      ))}
    </div>
  );

  const renderDisplays = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Displays ({robot.displays.length})</h3>
        <button
          onClick={addDisplay}
          style={{
            padding: '6px 12px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Add Display
        </button>
      </div>

      {robot.displays.length === 0 && (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No displays configured. Click "Add Display" to add one.</p>
      )}

      {robot.displays.map((display, index) => (
        <div key={index} style={{ 
          border: '1px solid #ccc', 
          borderRadius: '4px', 
          padding: '10px', 
          marginBottom: '10px',
          background: '#f9f9f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4 style={{ margin: 0 }}>Display {index + 1}</h4>
            <button
              onClick={() => removeDisplay(index)}
              style={{
                padding: '4px 8px',
                background: '#F44336',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Remove
            </button>
          </div>

          <label>Type:</label>
          <select
            value={display.type}
            onChange={e => updateDisplay(index, { type: e.target.value })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          >
            {DISPLAY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <label>Model:</label>
          <select
            value={display.model}
            onChange={e => updateDisplay(index, { model: e.target.value })}
            style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
          >
            {DISPLAY_MODELS.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>

          {display.type === 'OLED' && (
            <>
              <label>SDA Pin (I2C):</label>
              <input
                type="number"
                value={display.sda_pin || 20}
                onChange={e => updateDisplay(index, { sda_pin: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
              />

              <label>SCL Pin (I2C):</label>
              <input
                type="number"
                value={display.scl_pin || 21}
                onChange={e => updateDisplay(index, { scl_pin: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
              />

              <label>Width:</label>
              <input
                type="number"
                value={display.width}
                onChange={e => updateDisplay(index, { width: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
              />

              <label>Height:</label>
              <input
                type="number"
                value={display.height}
                onChange={e => updateDisplay(index, { height: parseInt(e.target.value) })}
                style={{ width: '100%', padding: '4px' }}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );

  const renderOtherSettings = () => (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h3>Wheels</h3>
        <label>Diameter (mm):</label>
        <input
          type="number"
          value={robot.wheels.diameter}
          onChange={e => updateWheels({ diameter: parseFloat(e.target.value) })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        />
        <label>Width (mm):</label>
        <input
          type="number"
          value={robot.wheels.width}
          onChange={e => updateWheels({ width: parseFloat(e.target.value) })}
          style={{ width: '100%', padding: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>PID Controller</h3>
        <label>Kp (Proportional):</label>
        <input
          type="number"
          step="0.1"
          value={robot.pid.kp}
          onChange={e => updatePID({ kp: parseFloat(e.target.value) })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        />
        <label>Ki (Integral):</label>
        <input
          type="number"
          step="0.01"
          value={robot.pid.ki}
          onChange={e => updatePID({ ki: parseFloat(e.target.value) })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        />
        <label>Kd (Derivative):</label>
        <input
          type="number"
          step="0.1"
          value={robot.pid.kd}
          onChange={e => updatePID({ kd: parseFloat(e.target.value) })}
          style={{ width: '100%', padding: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Speed Settings</h3>
        <label>Base Speed (0-255):</label>
        <input
          type="number"
          min="0"
          max="255"
          value={robot.base_speed}
          onChange={e => updateRobot({ base_speed: parseInt(e.target.value) })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        />
        <label>Max Speed (0-255):</label>
        <input
          type="number"
          min="0"
          max="255"
          value={robot.max_speed}
          onChange={e => updateRobot({ max_speed: parseInt(e.target.value) })}
          style={{ width: '100%', padding: '4px' }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Enhanced Robot Builder</h2>
      
      {/* Section Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '5px', 
        marginBottom: '20px',
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px'
      }}>
        {[
          { id: 'basic', label: '🔧 Basic' },
          { id: 'motors', label: '⚙️ Motors' },
          { id: 'encoders', label: '📊 Encoders' },
          { id: 'sensors', label: '👁️ Sensors' },
          { id: 'displays', label: '📺 Displays' },
          { id: 'other', label: '⚡ Other' }
        ].map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            style={{
              padding: '8px 16px',
              background: activeSection === section.id ? '#667eea' : '#f0f0f0',
              color: activeSection === section.id ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeSection === section.id ? 'bold' : 'normal'
            }}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div style={{ maxHeight: '600px', overflowY: 'auto', padding: '10px' }}>
        {activeSection === 'basic' && renderBasicInfo()}
        {activeSection === 'motors' && renderMotors()}
        {activeSection === 'encoders' && renderEncoders()}
        {activeSection === 'sensors' && renderSensors()}
        {activeSection === 'displays' && renderDisplays()}
        {activeSection === 'other' && renderOtherSettings()}
      </div>
    </div>
  );
};

export default RobotBuilderEnhanced;
