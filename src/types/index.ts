export type Priority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'Todo' | 'Doing' | 'Done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  tags: string[];
  createdAt: string;
  status: TaskStatus;
};

export type ActivityAction = 'created' | 'edited' | 'moved' | 'deleted';

export type ActivityEntry = {
  id: string;
  timestamp: string;
  timeLabel: string;
  message: string;
  taskTitle?: string;
  fromStatus?: TaskStatus;
  toStatus?: TaskStatus;
};
