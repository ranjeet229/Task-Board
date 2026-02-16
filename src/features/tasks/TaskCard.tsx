import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types';
import { Button } from '@/components/Button';

const priorityColors: Record<Task['priority'], string> = {
  Low: 'bg-emerald-100 text-emerald-800',
  Medium: 'bg-amber-100 text-amber-800',
  High: 'bg-red-100 text-red-800',
};

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-lg border border-slate-200 shadow-sm p-4
        hover:border-slate-300 transition-colors
        ${isDragging ? 'opacity-90 shadow-lg z-10 ring-2 ring-indigo-400' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <h3 className="font-medium text-slate-800 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-xs text-slate-400">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <Button variant="ghost" type="button" className="!p-1.5 text-slate-500" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`}>
            Edit
          </Button>
          <Button variant="ghost" type="button" className="!p-1.5 text-red-600 hover:text-red-700" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
