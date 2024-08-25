export interface Task {
  id: number;
  name: string;
  pomodoros: number;
  completedPomodoros: number;
  subtasks: Subtask[];
}

export interface Subtask {
  id: number;
  taskId: number;
  pomodoros: number;
  completedPomodoros: number;
  name: string;
}
