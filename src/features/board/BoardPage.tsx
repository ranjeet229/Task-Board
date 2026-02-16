import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { Task, TaskStatus } from '@/types';
import { clearAuthStorage } from '@/utils/auth-storage';
import { useBoardStore } from '@/store/board-store';
import { Column } from './Column';
import { ActivityPanel } from '@/features/activity/ActivityPanel';
import { TaskFormModal } from '@/features/tasks/TaskFormModal';
import { ConfirmModal } from '@/components/Modal';
import { Button } from '@/components/Button';
import type { TaskFormSubmitPayload } from '@/features/tasks/TaskFormModal';

const STATUSES: TaskStatus[] = ['Todo', 'Doing', 'Done'];

function filterAndSortTasks(
  tasks: Task[],
  searchQuery: string,
  filterPriority: Task['priority'] | '',
  sortByDueDate: boolean
): Task[] {
  let result = tasks;
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(q));
  }
  if (filterPriority) {
    result = result.filter((t) => t.priority === filterPriority);
  }
  if (sortByDueDate) {
    result = [...result].sort((a, b) => {
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return aDate - bDate;
    });
  }
  return result;
}

export function BoardPage() {
  const navigate = useNavigate();
  const {
    tasks,
    activity,
    searchQuery,
    filterPriority,
    sortByDueDate,
    hydrate,
    addTask,
    updateTask,
    moveTask,
    deleteTask,
    setSearchQuery,
    setFilterPriority,
    setSortByDueDate,
    resetBoard,
  } = useBoardStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Task | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filteredTasks = useMemo(
    () => filterAndSortTasks(tasks, searchQuery, filterPriority, sortByDueDate),
    [tasks, searchQuery, filterPriority, sortByDueDate]
  );

  const tasksByStatus = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = { Todo: [], Doing: [], Done: [] };
    for (const t of filteredTasks) {
      map[t.status].push(t);
    }
    return map;
  }, [filteredTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as string;
    const targetStatus: TaskStatus | undefined =
      STATUSES.includes(over.id as TaskStatus)
        ? (over.id as TaskStatus)
        : tasks.find((t) => t.id === over.id)?.status;
    if (targetStatus) {
      const task = tasks.find((t) => t.id === taskId);
      if (task && task.status !== targetStatus) {
        moveTask(taskId, targetStatus);
      }
    }
  };

  const handleLogout = () => {
    clearAuthStorage();
    navigate('/login', { replace: true });
  };

  const handleFormSubmit = (values: TaskFormSubmitPayload) => {
    if (editTask) {
      updateTask(editTask.id, values);
      setEditTask(null);
    } else {
      addTask(values);
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      deleteTask(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleResetConfirm = () => {
    resetBoard();
    setResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-slate-800">Task Board</h1>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Search tasks by title"
            />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority((e.target.value || '') as Task['priority'] | '')}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Filter by priority"
            >
              <option value="">All priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={sortByDueDate}
                onChange={(e) => setSortByDueDate(e.target.checked)}
              />
              Sort by due date
            </label>
            <Button type="button" onClick={() => setFormOpen(true)}>Add task</Button>
            <Button variant="secondary" type="button" onClick={() => setResetConfirm(true)}>
              Reset board
            </Button>
            <Button variant="ghost" type="button" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATUSES.map((status) => (
                  <Column
                    key={status}
                    status={status}
                    tasks={tasksByStatus[status]}
                    onEdit={(task) => {
                      setEditTask(task);
                      setFormOpen(true);
                    }}
                    onDelete={(task) => setDeleteConfirm(task)}
                  />
                ))}
              </div>
            </DndContext>
          </div>
          <div className="lg:col-span-1">
            <ActivityPanel entries={activity} />
          </div>
        </div>
      </main>

      <TaskFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTask(null);
        }}
        onSubmit={handleFormSubmit}
        initialTask={editTask}
      />

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete task"
        message={deleteConfirm ? `Are you sure you want to delete "${deleteConfirm.title}"?` : ''}
        confirmLabel="Delete"
        variant="danger"
      />

      <ConfirmModal
        open={resetConfirm}
        onClose={() => setResetConfirm(false)}
        onConfirm={handleResetConfirm}
        title="Reset board"
        message="This will clear all tasks and activity. This cannot be undone."
        confirmLabel="Reset"
        variant="danger"
      />
    </div>
  );
}
