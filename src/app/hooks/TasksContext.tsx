import React, { createContext, useContext, useEffect, useState } from "react";
import { Priority } from "../PriorityRating";

export interface Task {
  id: number;
  name: string;
  pomodoros: number;
  completedPomodoros: number;
  subtasks: Subtask[];
  note: string;
  priority: Priority;
}

export interface Subtask {
  id: number;
  taskId: number;
  pomodoros: number;
  completedPomodoros: number;
  name: string;
  note: string;
  priority: Priority;
}

interface TasksContextType {
  tasks: Task[];
  createTask: (newTask: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: number) => void;
  createSubtask: (subtask: Subtask) => void;
  updateSubtask: (updatedSubtask: Subtask) => void;
  deleteSubtask: (subtaskId: number) => void;
  findTask: (taskId: number) => Task | null;
  findSubtask: (subtaskId: number) => Subtask | null;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // if (typeof window !== "undefined") {
    //   const savedTasks = localStorage.getItem("tasks");
    //   return savedTasks ? JSON.parse(savedTasks) : [];
    // }
    return [];
  });

  // useEffect(() => {
  //   localStorage.setItem("tasks", JSON.stringify(tasks));
  // }, [tasks]);

  const createTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const createSubtask = (subtask: Subtask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === subtask.taskId
          ? { ...task, subtasks: [...task.subtasks, subtask] }
          : task
      )
    );
  };

  const updateSubtask = (updatedSubtask: Subtask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        subtasks: task.subtasks.map((subtask) =>
          subtask.id === updatedSubtask.id ? updatedSubtask : subtask
        ),
      }))
    );
  };

  const deleteSubtask = (subtaskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
      }))
    );
  };

  const findTask = (taskId: number): Task | null => {
    return tasks.find((task) => task.id === taskId) || null;
  };

  const findSubtask = (subtaskId: number): Subtask | null => {
    for (const task of tasks) {
      const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
      if (subtask) {
        return subtask;
      }
    }
    return null;
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
        createSubtask,
        updateSubtask,
        deleteSubtask,
        findTask,
        findSubtask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
