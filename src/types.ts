export interface NoteField {
  description: string;
  show_secs_before_transition_starts: number;
}

export interface PlaylistEntry {
  song_index: string;
  offset_sec: number;
  offset_frame: number;
  note: NoteField;
}

export interface Playlist {
  name: string;
  content: PlaylistEntry[];
}

export interface TimecodeConfig {
  fps: number;
  target_ip: string;
  target_port: number;
  stream_id: number;
}

export interface ControlInputConfig {
  mode: string;
  universe: number;
  address: number;
}

export interface OscConfig {
  enabled: boolean;
  target_ip: string;
  target_port: number;
  speedmaster: number;
}

export interface AppConfig {
  current_playlist: number;
  timecode: TimecodeConfig;
  control_input: ControlInputConfig;
  osc: OscConfig;
  playlists: Playlist[];
}

export interface CsvSong {
  title: string;
  artist: string;
  fileName: string;
}
