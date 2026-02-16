import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Task } from '@/types';
import { taskFormSchema, tagsInputToArray, type TaskFormValues } from './schemas';
import { Modal } from '@/components/Modal';
import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/Button';

export type TaskFormSubmitPayload = Pick<Task, 'title' | 'description' | 'priority' | 'dueDate'> & { tags: string[] };

export interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormSubmitPayload) => void;
  initialTask?: Task | null;
}

export function TaskFormModal({ open, onClose, onSubmit, initialTask }: TaskFormModalProps) {
  const isEdit = !!initialTask;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      tagsInput: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (initialTask) {
      reset({
        title: initialTask.title,
        description: initialTask.description ?? '',
        priority: initialTask.priority,
        dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : '',
        tagsInput: initialTask.tags.join(', '),
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        tagsInput: '',
      });
    }
  }, [open, initialTask, reset]);

  const onFormSubmit = (data: TaskFormValues) => {
    onSubmit({
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      tags: tagsInputToArray(data.tagsInput),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit task' : 'Create task'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="task-form">
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <FormInput
          label="Title"
          placeholder="Task title"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="space-y-1">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional description"
            {...register('description')}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id="priority"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            {...register('priority')}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <FormInput
          label="Due date"
          type="date"
          {...register('dueDate')}
        />
        <FormInput
          label="Tags (comma-separated)"
          placeholder="e.g. bug, frontend"
          {...register('tagsInput')}
        />
      </form>
    </Modal>
  );
}
