import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '@/types';
import { TaskCard } from '@/features/tasks/TaskCard';

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  Todo: { label: 'Todo', color: 'bg-indigo-50 border-indigo-200' },
  Doing: { label: 'Doing', color: 'bg-amber-50 border-amber-200' },
  Done: { label: 'Done', color: 'bg-emerald-50 border-emerald-200' },
};

export interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function Column({ status, tasks, onEdit, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = statusConfig[status];

  return (
    <div
      ref={setNodeRef}
      className={`
        rounded-xl border-2 min-h-[200px] flex flex-col transition-colors
        ${config.color}
        ${isOver ? 'ring-2 ring-indigo-400 ring-offset-2' : ''}
      `}
    >
      <div className="px-4 py-3 border-b border-inherit">
        <h2 className="font-semibold text-slate-800">
          {config.label}
          <span className="ml-2 text-slate-500 font-normal">({tasks.length})</span>
        </h2>
      </div>
      <div className="p-3 flex-1 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">
            No tasks yet. Drag tasks here or create one.
          </div>
        )}
      </div>
    </div>
  );
}
