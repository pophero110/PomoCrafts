"use client";
import React, { ReactNode, SetStateAction, useRef, useState } from "react";
import {
  FaClock,
  FaCheckCircle,
  FaPlay,
  FaTrash,
  FaPen,
  FaCheck,
} from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";
import { Task } from "../hooks/TasksContext";
import PriorityRating, { priorityOptions } from "../PriorityRating";
import { TaskState } from "./TaskManager";

interface TaskItemProps {
  task: Task;
  selectedTask: Task | null;
  setTaskState: React.Dispatch<SetStateAction<TaskState>>;
  handleUpdateTask: (oldTask: Task) => void;
  handleSelectTask: (taskId: number) => void;
  handleDeleteTask: (taskId: number) => void;
  startTimer: () => void;
  children: ReactNode;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  selectedTask,
  setTaskState,
  handleUpdateTask,
  handleSelectTask,
  handleDeleteTask,
  startTimer,
  children,
}) => {
  const [editingTaskState, setEditingTask] = useState<Task | null>(null);
  const taskNameInputRef = useRef<HTMLInputElement>(null);
  const isSelected = selectedTask?.id === task.id;
  const hasSubtask = task.subtasks.length != 0;
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTaskState) {
      setEditingTask({ ...editingTaskState, name: e.target.value });
    }
  };

  const handleEditingTaskComplete = () => {
    if (editingTaskState) {
      handleUpdateTask({ ...editingTaskState });
      setEditingTask(null);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEditingTaskComplete();
    }
  };

  const handleEditingTask = (e: React.MouseEvent) => {
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
      className="flex flex-col space-y-2 bg-gray-200 shadow-md rounded-md p-1 transition-all duration-300"
      onClick={() => handleSelectTask(task.id)}
    >
      <div
        className={`flex justify-between items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 ${
          isSelected
            ? "bg-blue-100 border-2 border-blue-500"
            : "hover:bg-gray-100 hover:shadow-lg"
        }`}
      >
        {editingTaskState ? (
          <div className="flex space-x-2 items-center">
            <PriorityRating
              selectedPriority={editingTaskState.priority}
              onChange={(priority) => {
                setEditingTask({ ...editingTaskState, priority });
              }}
            ></PriorityRating>
            <input
              ref={taskNameInputRef}
              id={`task-input-${task.id}`}
              className="border-b-2 text-lg font-medium border-gray-200 bg-transparent shadow-sm focus:outline-none focus:border-gray-500"
              value={editingTaskState.name}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            ></input>
            <FaCheck
              onClick={handleEditingTaskComplete}
              className="text-gray-500 cursor-pointer hover:text-gray-600 w-4 h-4"
            ></FaCheck>
          </div>
        ) : (
          <div className="flex space-x-2 items-center">
            {priorityOptions[task.priority].icon}
            <span className="text-lg font-medium flex-grow truncate">
              {task.name}
            </span>
            <FaPen
              onClick={handleEditingTask}
              className="text-gray-500 cursor-pointer hover:text-gray-600 w-4 h-4"
            ></FaPen>
          </div>
        )}
        <div className="flex items-center space-x-4">
          {!hasSubtask ? (
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
          {!hasSubtask && (
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
      {isSelected && children}
    </li>
  );
};

export default TaskItem;
