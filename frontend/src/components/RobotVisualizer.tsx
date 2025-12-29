import React, { useRef, useEffect } from 'react';
import { RobotConfig } from '../types';

interface RobotVisualizerProps {
  robot: RobotConfig;
}

const RobotVisualizer: React.FC<RobotVisualizerProps> = ({ robot }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawRobot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robot]);

  const drawRobot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, width, height);

    // Robot dimensions (scaled)
    const robotWidth = 120;
    const robotLength = 150;
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw robot body
    ctx.fillStyle = '#3f51b5';
    ctx.strokeStyle = '#1a237e';
    ctx.lineWidth = 2;
    ctx.fillRect(centerX - robotWidth / 2, centerY - robotLength / 2, robotWidth, robotLength);
    ctx.strokeRect(centerX - robotWidth / 2, centerY - robotLength / 2, robotWidth, robotLength);

    // Draw direction indicator (front)
    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - robotLength / 2 - 15);
    ctx.lineTo(centerX - 10, centerY - robotLength / 2);
    ctx.lineTo(centerX + 10, centerY - robotLength / 2);
    ctx.closePath();
    ctx.fill();

    // Draw motors
    robot.motors.forEach((motor, index) => {
      let motorX = centerX;
      let motorY = centerY;

      // Position based on motor position
      switch (motor.position) {
        case 'left':
          motorX = centerX - robotWidth / 2 - 15;
          motorY = centerY;
          break;
        case 'right':
          motorX = centerX + robotWidth / 2 + 15;
          motorY = centerY;
          break;
        case 'front':
          motorX = centerX;
          motorY = centerY - robotLength / 2 - 15;
          break;
        case 'back':
          motorX = centerX;
          motorY = centerY + robotLength / 2 + 15;
          break;
        default:
          // Custom position - distribute around
          const angle = (index / robot.motors.length) * Math.PI * 2;
          motorX = centerX + Math.cos(angle) * (robotWidth / 2 + 20);
          motorY = centerY + Math.sin(angle) * (robotLength / 2 + 20);
      }

      // Draw motor
      ctx.fillStyle = '#4caf50';
      ctx.strokeStyle = '#2e7d32';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(motorX, motorY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw motor label
      ctx.fillStyle = '#000';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`M${index + 1}`, motorX, motorY + 25);

      // Draw wheel
      if (motor.position === 'left' || motor.position === 'right') {
        ctx.fillStyle = '#212121';
        ctx.fillRect(motorX - 5, motorY - 15, 10, 30);
      }
    });

    // Draw sensors array (front)
    const sensorCount = robot.sensors.count;
    const sensorSpacing = Math.min(15, robotWidth / (sensorCount + 1));
    const sensorY = centerY - robotLength / 2 - 5;

    for (let i = 0; i < sensorCount; i++) {
      const sensorX = centerX - ((sensorCount - 1) * sensorSpacing) / 2 + i * sensorSpacing;
      
      ctx.fillStyle = '#f44336';
      ctx.beginPath();
      ctx.arc(sensorX, sensorY, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw sensor label
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${robot.sensors.type} x${sensorCount}`, centerX, sensorY - 10);

    // Draw ultrasonics
    robot.ultrasonics.forEach((ultrasonic, index) => {
      let usX = centerX;
      let usY = centerY;

      switch (ultrasonic.position) {
        case 'front':
          usX = centerX + (index - robot.ultrasonics.length / 2 + 0.5) * 30;
          usY = centerY - robotLength / 2 - 30;
          break;
        case 'back':
          usX = centerX + (index - robot.ultrasonics.length / 2 + 0.5) * 30;
          usY = centerY + robotLength / 2 + 30;
          break;
        case 'left':
          usX = centerX - robotWidth / 2 - 30;
          usY = centerY + (index - robot.ultrasonics.length / 2 + 0.5) * 30;
          break;
        case 'right':
          usX = centerX + robotWidth / 2 + 30;
          usY = centerY + (index - robot.ultrasonics.length / 2 + 0.5) * 30;
          break;
      }

      // Draw ultrasonic sensor
      ctx.fillStyle = '#00bcd4';
      ctx.strokeStyle = '#0097a7';
      ctx.lineWidth = 1;
      ctx.fillRect(usX - 8, usY - 6, 16, 12);
      ctx.strokeRect(usX - 8, usY - 6, 16, 12);

      // Draw sensor eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(usX - 4, usY, 2, 0, Math.PI * 2);
      ctx.arc(usX + 4, usY, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw displays
    robot.displays.forEach((display, index) => {
      const displayX = centerX;
      const displayY = centerY - robotLength / 2 + 30 + index * 25;

      ctx.fillStyle = '#000';
      ctx.strokeStyle = '#9e9e9e';
      ctx.lineWidth = 2;
      ctx.fillRect(displayX - 30, displayY - 10, 60, 20);
      ctx.strokeRect(displayX - 30, displayY - 10, 60, 20);

      ctx.fillStyle = '#4CAF50';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(display.model, displayX, displayY + 2);
    });

    // Draw encoders indicators
    robot.encoders.forEach((encoder, index) => {
      const motor = robot.motors[encoder.motor_index];
      if (!motor) return;

      let encX = centerX;
      let encY = centerY;

      switch (motor.position) {
        case 'left':
          encX = centerX - robotWidth / 2 - 15;
          encY = centerY;
          break;
        case 'right':
          encX = centerX + robotWidth / 2 + 15;
          encY = centerY;
          break;
      }

      // Draw encoder indicator
      ctx.strokeStyle = '#ff9800';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(encX, encY, 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ff9800';
      ctx.font = '8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('E', encX, encY + 3);
    });

    // Draw robot info
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`MCU: ${robot.mcu_board}`, 10, 20);
    ctx.fillText(`Motors: ${robot.motors.length}`, 10, 35);
    ctx.fillText(`Encoders: ${robot.encoders.length}`, 10, 50);
    ctx.fillText(`Displays: ${robot.displays.length}`, 10, 65);

    // Draw dimensions
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    // Width dimension
    ctx.beginPath();
    ctx.moveTo(centerX - robotWidth / 2, height - 30);
    ctx.lineTo(centerX + robotWidth / 2, height - 30);
    ctx.stroke();
    ctx.fillStyle = '#666';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${robotWidth}mm`, centerX, height - 15);

    ctx.setLineDash([]);
  };

  return (
    <div style={{ 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      padding: '10px', 
      background: '#fff',
      display: 'inline-block'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Robot Visualization</h3>
      <canvas
        ref={canvasRef}
        width={400}
        height={500}
        style={{ 
          display: 'block',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p style={{ margin: '5px 0' }}>🟦 = Robot Body</p>
        <p style={{ margin: '5px 0' }}>🟢 = Motors (M1, M2, ...)</p>
        <p style={{ margin: '5px 0' }}>🔴 = IR Sensors</p>
        <p style={{ margin: '5px 0' }}>🔵 = Ultrasonic Sensors</p>
        <p style={{ margin: '5px 0' }}>⬛ = Displays</p>
        <p style={{ margin: '5px 0' }}>🟠 = Encoders (E)</p>
      </div>
    </div>
  );
};

export default RobotVisualizer;
