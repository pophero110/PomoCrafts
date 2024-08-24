export interface Task {
  id: number;
  name: string;
  subtasks: Subtask[];
}

export interface Subtask {
  id: number;
  taskId: number;
  name: string;
}
