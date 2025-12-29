import React, { useState, useRef, useEffect } from 'react';
import { RobotConfig, Track } from '../types';

interface TestFirmwareSimulatorProps {
  robot: RobotConfig;
  track: Track;
}

interface SimulationState {
  position: { x: number; y: number };
  angle: number;
  leftSpeed: number;
  rightSpeed: number;
  sensorReadings: number[];
  isRunning: boolean;
  time: number;
  error: number;
  pidOutput: number;
}

const TestFirmwareSimulator: React.FC<TestFirmwareSimulatorProps> = ({ robot, track }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [simState, setSimState] = useState<SimulationState>({
    position: { x: 400, y: 500 },
    angle: -Math.PI / 2, // pointing up
    leftSpeed: 0,
    rightSpeed: 0,
    sensorReadings: Array(robot.sensors.count).fill(0),
    isRunning: false,
    time: 0,
    error: 0,
    pidOutput: 0
  });
  const [testResults, setTestResults] = useState<string[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    drawSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simState, track]);

  useEffect(() => {
    if (simState.isRunning) {
      animationRef.current = requestAnimationFrame(updateSimulation);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simState.isRunning]);

  const drawSimulation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw track elements
    track.elements.forEach(element => {
      ctx.save();
      ctx.translate(element.position.x, element.position.y);
      ctx.rotate((element.rotation * Math.PI) / 180);

      // Draw simple track representation
      ctx.fillStyle = '#333';
      const w = element.width;
      const h = element.length || 100;
      ctx.fillRect(-w / 2, -h / 2, w, h);

      ctx.restore();
    });

    // Draw a simple line for testing if no track elements
    if (track.elements.length === 0) {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 50;
      ctx.beginPath();
      ctx.moveTo(400, 600);
      ctx.lineTo(400, 100);
      ctx.stroke();
    }

    // Draw robot
    const { position, angle } = simState;
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(angle);

    // Robot body
    ctx.fillStyle = '#2196F3';
    ctx.strokeStyle = '#1565C0';
    ctx.lineWidth = 2;
    ctx.fillRect(-25, -30, 50, 60);
    ctx.strokeRect(-25, -30, 50, 60);

    // Direction indicator
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(-10, -20);
    ctx.lineTo(10, -20);
    ctx.closePath();
    ctx.fill();

    // Draw wheels with speed indication
    const leftSpeedRatio = simState.leftSpeed / 255;
    const rightSpeedRatio = simState.rightSpeed / 255;

    ctx.fillStyle = `rgba(76, 175, 80, ${leftSpeedRatio})`;
    ctx.fillRect(-30, -15, 8, 30);
    ctx.strokeRect(-30, -15, 8, 30);

    ctx.fillStyle = `rgba(76, 175, 80, ${rightSpeedRatio})`;
    ctx.fillRect(22, -15, 8, 30);
    ctx.strokeRect(22, -15, 8, 30);

    // Draw sensors
    const sensorSpacing = 40 / robot.sensors.count;
    for (let i = 0; i < robot.sensors.count; i++) {
      const sensorX = -20 + i * sensorSpacing;
      const sensorY = -35;
      const reading = simState.sensorReadings[i];
      
      ctx.fillStyle = reading > 0.5 ? '#000' : '#fff';
      ctx.strokeStyle = '#f44336';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sensorX, sensorY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();

    // Draw trail
    ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
    ctx.beginPath();
    ctx.arc(position.x, position.y, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  const readSensors = (): number[] => {
    // Simulate sensor readings based on position
    const readings = Array(robot.sensors.count).fill(0);
    const { position, angle } = simState;

    // Check if robot is on a line (simplified)
    const sensorSpacing = 40 / robot.sensors.count;
    
    for (let i = 0; i < robot.sensors.count; i++) {
      const sensorX = -20 + i * sensorSpacing;
      const worldX = position.x + sensorX * Math.cos(angle) - (-35) * Math.sin(angle);
      // worldY is calculated but not used in this simplified simulation
      // const worldY = position.y + sensorX * Math.sin(angle) + (-35) * Math.cos(angle);
      
      // Simple line detection: check if near x=400 (vertical line)
      const distanceFromLine = Math.abs(worldX - 400);
      readings[i] = distanceFromLine < 25 ? 1 : 0;
    }

    return readings;
  };

  const calculatePID = (error: number, prevError: number, integral: number): number => {
    const derivative = error - prevError;
    const newIntegral = integral + error;
    
    const output = robot.pid.kp * error + robot.pid.ki * newIntegral + robot.pid.kd * derivative;
    
    return output;
  };

  const updateSimulation = () => {
    if (!simState.isRunning) return;

    setSimState(prevState => {
      // Read sensors
      const sensorReadings = readSensors();
      
      // Calculate line position error
      let weightedSum = 0;
      let totalWeight = 0;
      sensorReadings.forEach((reading, i) => {
        weightedSum += reading * i;
        totalWeight += reading;
      });
      
      const linePosition = totalWeight > 0 ? weightedSum / totalWeight : robot.sensors.count / 2;
      const error = linePosition - robot.sensors.count / 2;
      
      // Calculate PID
      const pidOutput = calculatePID(error, prevState.error, 0);
      
      // Calculate motor speeds
      const baseSpeed = robot.base_speed;
      let leftSpeed = baseSpeed + pidOutput;
      let rightSpeed = baseSpeed - pidOutput;
      
      // Constrain speeds
      leftSpeed = Math.max(0, Math.min(robot.max_speed, leftSpeed));
      rightSpeed = Math.max(0, Math.min(robot.max_speed, rightSpeed));
      
      // Update position based on motor speeds
      const speed = (leftSpeed + rightSpeed) / 2 / 255; // normalized
      const turnRate = (rightSpeed - leftSpeed) / 255 * 0.05;
      
      const newAngle = prevState.angle + turnRate;
      const newX = prevState.position.x + Math.cos(newAngle) * speed * 5;
      const newY = prevState.position.y + Math.sin(newAngle) * speed * 5;
      
      // Check if out of bounds
      if (newX < 0 || newX > 800 || newY < 0 || newY > 600) {
        setTestResults(prev => [...prev, `⚠️ Robot went out of bounds at t=${prevState.time.toFixed(2)}s`]);
        return { ...prevState, isRunning: false };
      }
      
      return {
        ...prevState,
        position: { x: newX, y: newY },
        angle: newAngle,
        leftSpeed,
        rightSpeed,
        sensorReadings,
        time: prevState.time + 0.016, // ~60fps
        error,
        pidOutput
      };
    });
  };

  const startSimulation = () => {
    setTestResults(['✅ Simulation started']);
    setSimState({
      position: { x: 400, y: 500 },
      angle: -Math.PI / 2,
      leftSpeed: 0,
      rightSpeed: 0,
      sensorReadings: Array(robot.sensors.count).fill(0),
      isRunning: true,
      time: 0,
      error: 0,
      pidOutput: 0
    });
  };

  const stopSimulation = () => {
    setSimState(prev => ({ ...prev, isRunning: false }));
    setTestResults(prev => [...prev, `⏹️ Simulation stopped at t=${simState.time.toFixed(2)}s`]);
  };

  const resetSimulation = () => {
    setSimState({
      position: { x: 400, y: 500 },
      angle: -Math.PI / 2,
      leftSpeed: 0,
      rightSpeed: 0,
      sensorReadings: Array(robot.sensors.count).fill(0),
      isRunning: false,
      time: 0,
      error: 0,
      pidOutput: 0
    });
    setTestResults([]);
  };

  const validateFirmware = () => {
    const issues: string[] = [];
    
    // Check for GPIO conflicts
    const usedPins = new Set<number>();
    
    robot.motors.forEach((motor, i) => {
      motor.pins.forEach(pin => {
        if (usedPins.has(pin)) {
          issues.push(`⚠️ Pin ${pin} used by multiple components (Motor ${i + 1})`);
        }
        usedPins.add(pin);
      });
    });
    
    robot.sensors.pins.forEach(pin => {
      if (usedPins.has(pin)) {
        issues.push(`⚠️ Pin ${pin} used by multiple components (Sensors)`);
      }
      usedPins.add(pin);
    });
    
    robot.encoders.forEach((encoder, i) => {
      [encoder.pin_a, encoder.pin_b].forEach(pin => {
        if (usedPins.has(pin)) {
          issues.push(`⚠️ Pin ${pin} used by multiple components (Encoder ${i + 1})`);
        }
        usedPins.add(pin);
      });
    });
    
    // Check PID values
    if (robot.pid.kp === 0 && robot.pid.ki === 0 && robot.pid.kd === 0) {
      issues.push('⚠️ All PID values are zero - robot will not follow line');
    }
    
    // Check motor count
    if (robot.motors.length < 2) {
      issues.push('⚠️ Less than 2 motors configured - robot cannot move properly');
    }
    
    // Check speed settings
    if (robot.base_speed > robot.max_speed) {
      issues.push('⚠️ Base speed is greater than max speed');
    }
    
    if (issues.length === 0) {
      setTestResults(['✅ Firmware validation passed - no issues found']);
    } else {
      setTestResults(['❌ Firmware validation found issues:', ...issues]);
    }
  };

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      padding: '20px', 
      background: '#fff'
    }}>
      <h2>Test Firmware & Simulation</h2>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Simulation Canvas */}
        <div>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ 
              border: '2px solid #333',
              borderRadius: '4px',
              background: '#f0f0f0'
            }}
          />
          
          {/* Controls */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button
              onClick={startSimulation}
              disabled={simState.isRunning}
              style={{
                padding: '10px 20px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: simState.isRunning ? 'not-allowed' : 'pointer',
                opacity: simState.isRunning ? 0.5 : 1
              }}
            >
              ▶️ Start
            </button>
            <button
              onClick={stopSimulation}
              disabled={!simState.isRunning}
              style={{
                padding: '10px 20px',
                background: '#FF9800',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: !simState.isRunning ? 'not-allowed' : 'pointer',
                opacity: !simState.isRunning ? 0.5 : 1
              }}
            >
              ⏸️ Stop
            </button>
            <button
              onClick={resetSimulation}
              style={{
                padding: '10px 20px',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Reset
            </button>
            <button
              onClick={validateFirmware}
              style={{
                padding: '10px 20px',
                background: '#9C27B0',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔍 Validate Firmware
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            padding: '10px',
            marginBottom: '10px',
            background: '#f9f9f9'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Telemetry</h3>
            <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '12px' }}>
              Time: {simState.time.toFixed(2)}s
            </p>
            <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '12px' }}>
              Position: ({simState.position.x.toFixed(0)}, {simState.position.y.toFixed(0)})
            </p>
            <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '12px' }}>
              Angle: {(simState.angle * 180 / Math.PI).toFixed(1)}°
            </p>
            <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '12px' }}>
              Left Speed: {simState.leftSpeed.toFixed(0)}
            </p>
            <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '12px' }}>
              Right Speed: {simState.rightSpeed.toFixed(0)}
            </p>
            <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '12px' }}>
              Error: {simState.error.toFixed(2)}
            </p>
            <p style={{ margin: '5px 0', fontFamily: 'monospace', fontSize: '12px' }}>
              PID Output: {simState.pidOutput.toFixed(2)}
            </p>
          </div>

          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            padding: '10px',
            marginBottom: '10px',
            background: '#f9f9f9'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Sensor Readings</h3>
            <div style={{ display: 'flex', gap: '5px' }}>
              {simState.sensorReadings.map((reading, i) => (
                <div
                  key={i}
                  style={{
                    width: '20px',
                    height: '20px',
                    background: reading > 0.5 ? '#000' : '#fff',
                    border: '1px solid #666',
                    borderRadius: '2px'
                  }}
                  title={`Sensor ${i}: ${reading}`}
                />
              ))}
            </div>
          </div>

          <div style={{ 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
            padding: '10px',
            background: '#f9f9f9',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Test Results</h3>
            {testResults.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No test results yet</p>
            ) : (
              testResults.map((result, i) => (
                <p key={i} style={{ margin: '5px 0', fontSize: '12px' }}>
                  {result}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestFirmwareSimulator;
