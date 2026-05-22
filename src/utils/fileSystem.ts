import type { AppConfig } from '../types.ts';

export const hasFileSystemAccess = 'showOpenFilePicker' in window;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const w = window as any;

export async function openConfigFile(): Promise<{ config: AppConfig; handle: FileSystemFileHandle } | null> {
  try {
    const [handle]: FileSystemFileHandle[] = await w.showOpenFilePicker({
      types: [{ description: 'JSON Config', accept: { 'application/json': ['.json'] } }],
    });
    const file = await handle.getFile();
    const text = await file.text();
    const config = JSON.parse(text) as AppConfig;
    return { config, handle };
  } catch (e) {
    if ((e as Error).name !== 'AbortError') throw e;
    return null;
  }
}

export async function saveToHandle(handle: FileSystemFileHandle, config: AppConfig): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(config, null, 4));
  await writable.close();
}

export async function saveAsNewFile(config: AppConfig): Promise<FileSystemFileHandle | null> {
  if (!hasFileSystemAccess) {
    downloadConfig(config);
    return null;
  }
  try {
    const handle: FileSystemFileHandle = await w.showSaveFilePicker({
      suggestedName: 'config.json',
      types: [{ description: 'JSON Config', accept: { 'application/json': ['.json'] } }],
    });
    await saveToHandle(handle, config);
    return handle;
  } catch (e) {
    if ((e as Error).name !== 'AbortError') {
      downloadConfig(config);
    }
    return null;
  }
}

export function downloadConfig(config: AppConfig): void {
  const blob = new Blob([JSON.stringify(config, null, 4)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'config.json';
  a.click();
  URL.revokeObjectURL(url);
}
