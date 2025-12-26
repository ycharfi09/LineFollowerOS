import axios from 'axios';
import { Track, RobotConfig, FirmwareConfig } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const trackAPI = {
  analyze: async (track: Track) => {
    const response = await axios.post(`${API_BASE_URL}/track/analyze`, track);
    return response.data;
  },
  
  toGraph: async (track: Track) => {
    const response = await axios.post(`${API_BASE_URL}/track/to-graph`, track);
    return response.data;
  },
  
  validate: async (track: Track) => {
    const response = await axios.post(`${API_BASE_URL}/track/validate`, track);
    return response.data;
  }
};

export const robotAPI = {
  validate: async (robot: RobotConfig) => {
    const response = await axios.post(`${API_BASE_URL}/robot/validate`, robot);
    return response.data;
  },
  
  test: async (robot: RobotConfig) => {
    const response = await axios.post(`${API_BASE_URL}/robot/test`, robot);
    return response.data;
  }
};

export const firmwareAPI = {
  generate: async (track: Track, robot: RobotConfig): Promise<FirmwareConfig> => {
    const response = await axios.post(`${API_BASE_URL}/firmware/generate`, null, {
      params: { track, robot }
    });
    return response.data;
  },
  
  generateCode: async (track: Track, robot: RobotConfig): Promise<string> => {
    const response = await axios.post(`${API_BASE_URL}/firmware/generate/code`, null, {
      params: { track, robot }
    });
    return response.data;
  },
  
  generateStrategy: async (track: Track, robot: RobotConfig) => {
    const response = await axios.post(`${API_BASE_URL}/firmware/strategy`, null, {
      params: { track, robot }
    });
    return response.data;
  }
};
