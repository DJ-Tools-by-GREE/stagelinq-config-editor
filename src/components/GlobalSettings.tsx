import { useState } from 'react';
import type { AppConfig } from '../types.ts';

interface Props {
  config: AppConfig;
  onChange: (config: AppConfig) => void;
}

export function GlobalSettings({ config, onChange }: Props) {
  const [open, setOpen] = useState(true);

  const setTimecode = (patch: Partial<AppConfig['timecode']>) =>
    onChange({ ...config, timecode: { ...config.timecode, ...patch } });

  const setControlInput = (patch: Partial<AppConfig['control_input']>) =>
    onChange({ ...config, control_input: { ...config.control_input, ...patch } });

  const setOsc = (patch: Partial<AppConfig['osc']>) =>
    onChange({ ...config, osc: { ...config.osc, ...patch } });

  return (
    <section className="global-settings">
      <div className="section-header" onClick={() => setOpen(o => !o)}>
        <span className="section-toggle">{open ? '▾' : '▸'}</span>
        <h2>Global Settings</h2>
      </div>

      {open && (
        <div className="settings-grid">
          <div className="settings-card">
            <h3>Timecode</h3>
            <label>
              Target IP
              <input
                type="text"
                value={config.timecode.target_ip}
                onChange={e => setTimecode({ target_ip: e.target.value })}
              />
            </label>
            <label>
              Target Port
              <input
                type="number"
                value={config.timecode.target_port}
                onChange={e => setTimecode({ target_port: Number(e.target.value) })}
              />
            </label>
            <label>
              FPS
              <input
                type="number"
                step="0.01"
                value={config.timecode.fps}
                onChange={e => setTimecode({ fps: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="settings-card">
            <h3>Control Input</h3>
            <label>
              Mode
              <select
                value={config.control_input.mode}
                onChange={e => setControlInput({ mode: e.target.value })}
              >
                <option value="sacn">sACN</option>
                <option value="artnet">Art-Net</option>
              </select>
            </label>
            <label>
              Universe
              <input
                type="number"
                value={config.control_input.universe}
                onChange={e => setControlInput({ universe: Number(e.target.value) })}
              />
            </label>
            <label>
              DMX Address
              <input
                type="number"
                value={config.control_input.address}
                onChange={e => setControlInput({ address: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="settings-card">
            <h3>OSC</h3>
            <label className="label-inline">
              <span>Enabled</span>
              <input
                type="checkbox"
                checked={config.osc.enabled}
                onChange={e => setOsc({ enabled: e.target.checked })}
              />
            </label>
            <label>
              Target IP
              <input
                type="text"
                value={config.osc.target_ip}
                onChange={e => setOsc({ target_ip: e.target.value })}
              />
            </label>
            <label>
              Target Port
              <input
                type="number"
                value={config.osc.target_port}
                onChange={e => setOsc({ target_port: Number(e.target.value) })}
              />
            </label>
            <label>
              SpeedMaster Ch
              <input
                type="number"
                value={config.osc.speedmaster}
                onChange={e => setOsc({ speedmaster: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="settings-card">
            <h3>Active Playlist</h3>
            <label>
              Index
              <select
                value={config.current_playlist}
                onChange={e => onChange({ ...config, current_playlist: Number(e.target.value) })}
              >
                {config.playlists.length === 0 && <option value={0}>— none —</option>}
                {config.playlists.map((pl, i) => (
                  <option key={i} value={i}>{i}: {pl.name}</option>
                ))}
              </select>
            </label>
            <p className="hint">
              This index is written to config.json and controls which playlist the backend uses at runtime.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
