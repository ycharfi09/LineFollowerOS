import React, { useState } from 'react';
import { Track, RobotConfig } from '../types';
import { firmwareAPI } from '../services/api';

interface FirmwareGeneratorProps {
  track: Track;
  robot: RobotConfig;
}

const FirmwareGenerator: React.FC<FirmwareGeneratorProps> = ({ track, robot }) => {
  const [loading, setLoading] = useState(false);
  const [firmware, setFirmware] = useState<string>('');
  const [error, setError] = useState<string>('');

  const generateFirmware = async () => {
    setLoading(true);
    setError('');
    try {
      const code = await firmwareAPI.generateCode(track, robot);
      setFirmware(code);
    } catch (err) {
      setError('Failed to generate firmware. Please check your track and robot configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadFirmware = () => {
    const blob = new Blob([firmware], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${robot.name.replace(/\s+/g, '_')}_firmware.ino`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', background: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Firmware Generator</h2>
      
      <button
        onClick={generateFirmware}
        disabled={loading || track.elements.length === 0}
        style={{
          padding: '12px 24px',
          background: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'wait' : 'pointer',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Generating...' : 'Generate Firmware'}
      </button>

      {error && (
        <div style={{ padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {firmware && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3>Generated Firmware</h3>
            <button
              onClick={downloadFirmware}
              style={{
                padding: '8px 16px',
                background: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Download .ino
            </button>
          </div>
          <pre style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '500px',
            fontSize: '12px',
            border: '1px solid #ddd'
          }}>
            {firmware}
          </pre>
        </div>
      )}

      {!firmware && !loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p>Configure your track and robot, then click "Generate Firmware" to create your custom firmware.</p>
        </div>
      )}
    </div>
  );
};

export default FirmwareGenerator;
