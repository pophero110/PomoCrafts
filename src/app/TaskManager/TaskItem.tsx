"use client";
import React, { ReactNode, useRef, useState } from "react";
import { FaClock, FaCheckCircle, FaPlay, FaTrash } from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";
import { Task } from "../hooks/TasksContext";

interface TaskItemProps {
  task: Task;
  selectedTask: Task | null;
  handleUpdateTask: (oldTask: Task) => void;
  handleSelectTask: (taskId: number) => void;
  handleDeleteTask: (taskId: number) => void;
  startTimer: () => void;
  children: ReactNode;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  selectedTask,
  handleUpdateTask,
  handleSelectTask,
  handleDeleteTask,
  startTimer,
  children,
}) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const taskNameInputRef = useRef<HTMLInputElement>(null);

  const isSelected = selectedTask?.id === task.id;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, name: e.target.value });
    }
  };

  const handleInputBlur = () => {
    if (editingTask) {
      handleUpdateTask({ ...editingTask });
      setEditingTask(null);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && editingTask) {
      e.preventDefault();
      handleUpdateTask({ ...editingTask });
      setEditingTask(null);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setTimeout(() => taskNameInputRef.current?.focus(), 0);
  };

  const totalRemainingPomodoros = task.subtasks.reduce(
    (total, subtask) =>
      total + (subtask.pomodoros - subtask.completedPomodoros),
    0
  );

  const totalCompletedPomodoros = task.subtasks.reduce(
    (total, subtask) => total + subtask.completedPomodoros,
    0
  );

  return (
    <li
      key={task.id}
      className="flex flex-col space-y-2 bg-white shadow-md rounded-md p-2 transition-all duration-300"
      onClick={() => handleSelectTask(task.id)}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`flex items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 ${
          isSelected
            ? "bg-blue-100 border-2 border-blue-500"
            : "hover:bg-gray-100 hover:shadow-lg"
        }`}
      >
        {editingTask ? (
          <input
            ref={taskNameInputRef}
            id={`task-input-${task.id}`}
            className="border border-gray-300 rounded-lg p-4 flex-grow resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editingTask.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
          />
        ) : (
          <span className="text-lg font-medium flex-grow truncate">
            {task.name}
          </span>
        )}
        <div className="flex items-center space-x-4">
          {task.subtasks.length === 0 ? (
            <PomodorosRating
              value={task.pomodoros}
              completed={task.completedPomodoros}
              onChange={(event, pomodoros) =>
                handleUpdateTask({ ...task, pomodoros })
              }
            />
          ) : (
            <div className="flex items-center space-x-2">
              <FaClock className="text-red-500 w-6 h-6" />
              <span className="font-semibold">{totalRemainingPomodoros}</span>
              <FaCheckCircle className="text-green-500 w-6 h-6" />
              <span className="font-semibold">{totalCompletedPomodoros}</span>
            </div>
          )}
          {task.subtasks.length === 0 && (
            <FaPlay
              className="text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer"
              onClick={startTimer}
            />
          )}
          <FaTrash
            className="text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer"
            onClick={() => handleDeleteTask(task.id)}
          />
        </div>
      </div>
      {children}
    </li>
  );
};

export default TaskItem;
