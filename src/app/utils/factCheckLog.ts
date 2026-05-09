/**
 * Per-festival "verified against the official Instagram / website" log.
 * Lives in localStorage so a fact-check session survives a refresh.
 */

const STORAGE_KEY = 'cuban-salsa-festivals-factcheck-log';

export interface FactCheckEntry {
  /** ISO timestamp of the most recent verification. */
  checkedAt: string;
  /** Optional free-form note from the reviewer. */
  note?: string;
}

export type FactCheckLog = Record<string, FactCheckEntry>;

export function readFactCheckLog(): FactCheckLog {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as FactCheckLog) : {};
  } catch (error) {
    console.error('Failed to read fact-check log:', error);
    return {};
  }
}

function writeFactCheckLog(log: FactCheckLog): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch (error) {
    console.error('Failed to write fact-check log:', error);
  }
}

export function markVerified(festivalId: string, note?: string): FactCheckLog {
  const log = readFactCheckLog();
  log[festivalId] = {
    checkedAt: new Date().toISOString(),
    ...(note ? { note } : {}),
  };
  writeFactCheckLog(log);
  return log;
}

export function unmarkVerified(festivalId: string): FactCheckLog {
  const log = readFactCheckLog();
  delete log[festivalId];
  writeFactCheckLog(log);
  return log;
}

export function clearFactCheckLog(): FactCheckLog {
  writeFactCheckLog({});
  return {};
}

/**
 * A check older than this is considered stale ("overdue") and worth
 * re-verifying. 30 days is a reasonable cadence for festival info that
 * tends to drift over a season.
 */
export const OVERDUE_DAYS = 30;

export function isOverdue(entry: FactCheckEntry | undefined): boolean {
  if (!entry) return true;
  const ms = Date.now() - new Date(entry.checkedAt).getTime();
  return ms > OVERDUE_DAYS * 24 * 60 * 60 * 1000;
}

export function formatRelativeAge(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}mo ago`;
  const year = Math.floor(day / 365);
  return `${year}y ago`;
}
