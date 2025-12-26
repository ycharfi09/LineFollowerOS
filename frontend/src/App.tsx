import React, { useState } from 'react';
import './App.css';
import TrackEditor from './components/TrackEditor';
import RobotBuilder from './components/RobotBuilder';
import FirmwareGenerator from './components/FirmwareGenerator';
import { Track, RobotConfig, TrackElement, ElementType } from './types';

function App() {
  const [track, setTrack] = useState<Track>({
    name: 'My Track',
    elements: [],
    width: 800,
    height: 600
  });

  const [robot, setRobot] = useState<RobotConfig>({
    name: 'My Robot',
    motor_left: {
      type: 'DC',
      max_rpm: 200,
      pins: [9, 10]
    },
    motor_right: {
      type: 'DC',
      max_rpm: 200,
      pins: [5, 6]
    },
    wheels: {
      diameter: 65.0,
      width: 20.0
    },
    sensors: {
      type: 'IR',
      count: 8,
      spacing: 10.0,
      pins: [0, 1, 2, 3, 4, 5, 6, 7]
    },
    pid: {
      kp: 1.0,
      ki: 0.0,
      kd: 0.5
    },
    base_speed: 150,
    max_speed: 200,
    platform: 'arduino'
  });

  const [activeTab, setActiveTab] = useState<'track' | 'robot' | 'firmware'>('track');

  const handleElementsChange = (elements: TrackElement[]) => {
    setTrack({ ...track, elements });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '32px' }}>LineFollowerOS</h1>
        <p style={{ margin: '10px 0 0', fontSize: '16px' }}>
          Web-based Track & Robot Builder - Generate Ready-to-Flash Firmware
        </p>
      </header>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0',
        background: '#f5f5f5',
        borderBottom: '2px solid #ddd',
        padding: '0'
      }}>
        {(['track', 'robot', 'firmware'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '15px 30px',
              background: activeTab === tab ? '#fff' : 'transparent',
              color: activeTab === tab ? '#667eea' : '#666',
              border: 'none',
              borderBottom: activeTab === tab ? '3px solid #667eea' : 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              textTransform: 'capitalize'
            }}
          >
            {tab} {tab === 'track' ? '🏁' : tab === 'robot' ? '🤖' : '⚙️'}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {activeTab === 'track' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={track.name}
                onChange={e => setTrack({ ...track, name: e.target.value })}
                placeholder="Track Name"
                style={{
                  padding: '10px',
                  fontSize: '18px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  width: '300px'
                }}
              />
              <div style={{ marginTop: '10px', color: '#666' }}>
                Elements: {track.elements.length}
              </div>
            </div>
            <TrackEditor
              elements={track.elements}
              onElementsChange={handleElementsChange}
              width={track.width}
              height={track.height}
            />
          </div>
        )}

        {activeTab === 'robot' && (
          <RobotBuilder robot={robot} onRobotChange={setRobot} />
        )}

        {activeTab === 'firmware' && (
          <FirmwareGenerator track={track} robot={robot} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#f5f5f5',
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px',
        borderTop: '1px solid #ddd'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          LineFollowerOS v1.0.0 - Built for Competition Line Follower Robots
        </p>
      </footer>
    </div>
  );
}

export default App;
