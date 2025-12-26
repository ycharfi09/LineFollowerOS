import React from 'react';
import { RobotConfig, MotorConfig, WheelConfig, SensorConfig, PIDConfig } from '../types';

interface RobotBuilderProps {
  robot: RobotConfig;
  onRobotChange: (robot: RobotConfig) => void;
}

const RobotBuilder: React.FC<RobotBuilderProps> = ({ robot, onRobotChange }) => {
  const updateRobot = (updates: Partial<RobotConfig>) => {
    onRobotChange({ ...robot, ...updates });
  };

  const updateMotor = (side: 'left' | 'right', updates: Partial<MotorConfig>) => {
    const motorKey = side === 'left' ? 'motor_left' : 'motor_right';
    updateRobot({
      [motorKey]: { ...robot[motorKey], ...updates }
    });
  };

  const updateWheels = (updates: Partial<WheelConfig>) => {
    updateRobot({ wheels: { ...robot.wheels, ...updates } });
  };

  const updateSensors = (updates: Partial<SensorConfig>) => {
    updateRobot({ sensors: { ...robot.sensors, ...updates } });
  };

  const updatePID = (updates: Partial<PIDConfig>) => {
    updateRobot({ pid: { ...robot.pid, ...updates } });
  };

  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Robot Builder</h2>
      
      {/* Robot Name */}
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

      {/* Platform */}
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

      {/* Motors */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Motors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <h4>Left Motor</h4>
            <label>Max RPM:</label>
            <input
              type="number"
              value={robot.motor_left.max_rpm}
              onChange={e => updateMotor('left', { max_rpm: parseInt(e.target.value) })}
              style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
            />
          </div>
          <div>
            <h4>Right Motor</h4>
            <label>Max RPM:</label>
            <input
              type="number"
              value={robot.motor_right.max_rpm}
              onChange={e => updateMotor('right', { max_rpm: parseInt(e.target.value) })}
              style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
            />
          </div>
        </div>
      </div>

      {/* Wheels */}
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

      {/* Sensors */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Sensors</h3>
        <label>Type:</label>
        <select
          value={robot.sensors.type}
          onChange={e => updateSensors({ type: e.target.value })}
          style={{ width: '100%', padding: '4px', marginBottom: '5px' }}
        >
          <option value="IR">IR (Infrared)</option>
          <option value="Color">Color</option>
          <option value="Ultrasonic">Ultrasonic</option>
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
          style={{ width: '100%', padding: '4px' }}
        />
      </div>

      {/* PID */}
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

      {/* Speed */}
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
};

export default RobotBuilder;
