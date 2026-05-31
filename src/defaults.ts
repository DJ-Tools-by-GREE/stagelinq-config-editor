import type { AppConfig } from './types.ts';

export const DEFAULT_CONFIG: AppConfig = {
  current_playlist: 0,
  timecode: { fps: 30, target_ip: '10.15.10.117', target_port: 6454, stream_id: 0 },
  control_input: { mode: 'sacn', universe: 20, address: 1 },
  osc: { enabled: true, target_ip: '10.15.10.117', target_port: 8000, speedmaster: 15 },
  playlists: [],
};

export const DEFAULT_OFFSET_START = 10800;
export const DEFAULT_OFFSET_INCREMENT = 600;
