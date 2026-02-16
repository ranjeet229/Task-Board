import { z } from 'zod';

const priorityEnum = z.enum(['Low', 'Medium', 'High']);

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: priorityEnum.default('Medium'),
  dueDate: z.string().optional(),
  tagsInput: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export function tagsInputToArray(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value.split(',').map((t) => t.trim()).filter(Boolean);
}
