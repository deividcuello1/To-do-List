export interface Task {
  id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assigneeId: number;
  createdAt?: string;
  updatedAt?: string;
  userName?: string;
}
