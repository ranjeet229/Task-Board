import { create } from 'zustand';
import type { Task, TaskStatus, ActivityEntry } from '@/types';
import { getStoredTasks, setStoredTasks, getStoredActivity, setStoredActivity, clearBoardStorage } from '@/utils/storage';
import { generateId } from '@/utils/id';

function parseTasks(raw: unknown[]): Task[] {
  return raw
    .filter(
      (t): t is Record<string, unknown> =>
        t != null &&
        typeof t === 'object' &&
        typeof (t as Task).id === 'string' &&
        typeof (t as Task).title === 'string'
    )
    .map((t) => ({
      id: String(t.id),
      title: String(t.title),
      description: t.description != null ? String(t.description) : undefined,
      priority: ['Low', 'Medium', 'High'].includes(String(t.priority)) ? (t.priority as Task['priority']) : 'Medium',
      dueDate: t.dueDate != null ? String(t.dueDate) : undefined,
      tags: Array.isArray(t.tags) ? t.tags.map(String) : [],
      createdAt: String(t.createdAt ?? new Date().toISOString()),
      status: ['Todo', 'Doing', 'Done'].includes(String(t.status)) ? (t.status as TaskStatus) : 'Todo',
    }));
}

function parseActivity(raw: unknown[]): ActivityEntry[] {
  return raw
    .filter(
      (a): a is Record<string, unknown> =>
        a != null && typeof a === 'object' && typeof (a as ActivityEntry).id === 'string'
    )
    .map((a) => ({
      id: String(a.id),
      timestamp: String(a.timestamp),
      timeLabel: String(a.timeLabel),
      message: String(a.message),
      taskTitle: a.taskTitle != null ? String(a.taskTitle) : undefined,
      fromStatus: a.fromStatus as ActivityEntry['fromStatus'],
      toStatus: a.toStatus as ActivityEntry['toStatus'],
    }));
}

function timeLabel(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

type BoardState = {
  tasks: Task[];
  activity: ActivityEntry[];
  searchQuery: string;
  filterPriority: Task['priority'] | '';
  sortByDueDate: boolean;
  hydrate: () => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'> & { status?: TaskStatus }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  moveTask: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setFilterPriority: (p: Task['priority'] | '') => void;
  setSortByDueDate: (v: boolean) => void;
  resetBoard: () => void;
  logActivity: (entry: Omit<ActivityEntry, 'id' | 'timestamp' | 'timeLabel'>) => void;
};

const MAX_ACTIVITY = 10;

export const useBoardStore = create<BoardState>((set, get) => ({
  tasks: [],
  activity: [],
  searchQuery: '',
  filterPriority: '',
  sortByDueDate: false,

  hydrate: () => {
    const rawTasks = getStoredTasks();
    const rawActivity = getStoredActivity();
    set({
      tasks: parseTasks(rawTasks),
      activity: parseActivity(rawActivity).slice(-MAX_ACTIVITY),
    });
  },

  logActivity: (entry) => {
    const id = generateId();
    const timestamp = new Date().toISOString();
    const timeLabelStr = timeLabel();
    const newEntry: ActivityEntry = { ...entry, id, timestamp, timeLabel: timeLabelStr };
    const next = [...get().activity, newEntry].slice(-MAX_ACTIVITY);
    setStoredActivity(next);
    set({ activity: next });
  },

  addTask: (input) => {
    const status = input.status ?? 'Todo';
    const task: Task = {
      id: generateId(),
      title: input.title,
      description: input.description,
      priority: input.priority ?? 'Medium',
      dueDate: input.dueDate,
      tags: input.tags ?? [],
      createdAt: new Date().toISOString(),
      status,
    };
    set((s) => {
      const tasks = [...s.tasks, task];
      setStoredTasks(tasks);
      get().logActivity({
        message: `Task "${task.title}" created`,
        taskTitle: task.title,
      });
      return { tasks };
    });
  },

  updateTask: (id, updates) => {
    set((s) => {
      const tasks = s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      setStoredTasks(tasks);
      const task = tasks.find((t) => t.id === id);
      if (task)
        get().logActivity({
          message: `Task "${task.title}" edited`,
          taskTitle: task.title,
        });
      return { tasks };
    });
  },

  moveTask: (id, status) => {
    set((s) => {
      const prev = s.tasks.find((t) => t.id === id);
      if (!prev) return s;
      const tasks = s.tasks.map((t) => (t.id === id ? { ...t, status } : t));
      setStoredTasks(tasks);
      get().logActivity({
        message: `Task "${prev.title}" moved from ${prev.status} → ${status}`,
        taskTitle: prev.title,
        fromStatus: prev.status,
        toStatus: status,
      });
      return { tasks };
    });
  },

  deleteTask: (id) => {
    set((s) => {
      const task = s.tasks.find((t) => t.id === id);
      const tasks = s.tasks.filter((t) => t.id !== id);
      setStoredTasks(tasks);
      if (task)
        get().logActivity({
          message: `Task "${task.title}" deleted`,
          taskTitle: task.title,
        });
      return { tasks };
    });
  },

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterPriority: (filterPriority) => set({ filterPriority }),
  setSortByDueDate: (sortByDueDate) => set({ sortByDueDate }),

  resetBoard: () => {
    clearBoardStorage();
    set({ tasks: [], activity: [] });
  },
}));
