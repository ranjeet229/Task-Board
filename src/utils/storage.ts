const BOARD_KEY = 'task-board:tasks';
const ACTIVITY_KEY = 'task-board:activity';

function safeParse<T>(json: string | null, fallback: T): T {
  if (json == null || json === '') return fallback;
  try {
    const parsed = JSON.parse(json) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function getStoredTasks(): unknown[] {
  if (typeof window === 'undefined') return [];
  return safeParse(localStorage.getItem(BOARD_KEY), []);
}

export function setStoredTasks(tasks: unknown[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to persist tasks', e);
  }
}

export function getStoredActivity(): unknown[] {
  if (typeof window === 'undefined') return [];
  return safeParse(localStorage.getItem(ACTIVITY_KEY), []);
}

export function setStoredActivity(entries: unknown[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn('Failed to persist activity', e);
  }
}

export function clearBoardStorage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(BOARD_KEY);
  localStorage.removeItem(ACTIVITY_KEY);
}
