import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from './board-store';

describe('board-store', () => {
  beforeEach(() => {
    useBoardStore.setState({
      tasks: [],
      activity: [],
    });
    localStorage.clear();
    sessionStorage.clear();
  });

  it('addTask adds a task to state and persists to localStorage', () => {
    const { addTask } = useBoardStore.getState();
    addTask({
      title: 'New task',
      description: 'Desc',
      priority: 'High',
      tags: ['a', 'b'],
    });
    const state = useBoardStore.getState();
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].title).toBe('New task');
    expect(state.tasks[0].priority).toBe('High');
    expect(state.tasks[0].status).toBe('Todo');
    expect(state.tasks[0].tags).toEqual(['a', 'b']);
    const raw = localStorage.getItem('task-board:tasks');
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('New task');
  });

  it('moveTask updates task status and persists', () => {
    const { addTask, moveTask } = useBoardStore.getState();
    addTask({ title: 'Move me', priority: 'Medium', tags: [] });
    const id = useBoardStore.getState().tasks[0].id;
    moveTask(id, 'Doing');
    expect(useBoardStore.getState().tasks[0].status).toBe('Doing');
    moveTask(id, 'Done');
    expect(useBoardStore.getState().tasks[0].status).toBe('Done');
    const raw = localStorage.getItem('task-board:tasks');
    const parsed = JSON.parse(raw!);
    expect(parsed[0].status).toBe('Done');
  });
});
