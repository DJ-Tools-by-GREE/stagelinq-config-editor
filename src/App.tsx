import { useState } from 'react';
import type { AppConfig } from './types.ts';
import { DEFAULT_CONFIG } from './defaults.ts';
import {
  openConfigFile,
  saveAsNewFile,
  saveToHandle,
  hasFileSystemAccess,
} from './utils/fileSystem.ts';
import { GlobalSettings } from './components/GlobalSettings.tsx';
import { PlaylistEditor } from './components/PlaylistEditor.tsx';

export function App() {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState('');

  const updateConfig = (next: AppConfig) => {
    setConfig(next);
    setDirty(true);
  };

  const handleNew = () => {
    if (dirty && !confirm('Discard unsaved changes and start a new config?')) return;
    setConfig(DEFAULT_CONFIG);
    setFileHandle(null);
    setFileName(null);
    setDirty(false);
  };

  const handleOpen = async () => {
    try {
      const result = await openConfigFile();
      if (!result) return;
      setConfig(result.config);
      setFileHandle(result.handle);
      setFileName(result.handle.name);
      setDirty(false);
      setSaveError('');
    } catch (e) {
      setSaveError(`Failed to open: ${(e as Error).message}`);
    }
  };

  const handleSave = async () => {
    setSaveError('');
    try {
      if (fileHandle) {
        await saveToHandle(fileHandle, config);
        setDirty(false);
      } else {
        await handleSaveAs();
      }
    } catch (e) {
      setSaveError(`Save failed: ${(e as Error).message}`);
    }
  };

  const handleSaveAs = async () => {
    setSaveError('');
    try {
      const handle = await saveAsNewFile(config);
      if (handle) {
        setFileHandle(handle);
        setFileName(handle.name);
        setDirty(false);
      }
    } catch (e) {
      setSaveError(`Save failed: ${(e as Error).message}`);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="logo">◈</span>
          <span className="title">StageLinq Config Editor</span>
        </div>

        <div className="header-file">
          {fileName ? (
            <span className="file-indicator">
              {fileName}{dirty ? <span className="dirty-dot"> *</span> : null}
            </span>
          ) : (
            <span className="file-indicator muted">
              New config{dirty ? <span className="dirty-dot"> *</span> : null}
            </span>
          )}
        </div>

        <div className="header-actions">
          {!hasFileSystemAccess && (
            <span className="hint" title="File System Access API not available. Save As will download the file.">
              ⚠ Download mode
            </span>
          )}
          <button className="btn btn-secondary" onClick={handleNew}>New</button>
          <button className="btn btn-secondary" onClick={handleOpen}>Open</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!dirty && !!fileHandle}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleSaveAs}>Save As</button>
        </div>
      </header>

      {saveError && (
        <div className="error-banner">{saveError}</div>
      )}

      <main className="app-main">
        <GlobalSettings config={config} onChange={updateConfig} />
        <PlaylistEditor config={config} onChange={updateConfig} />
      </main>
    </div>
  );
}
