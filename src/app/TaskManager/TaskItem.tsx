import React, { KeyboardEvent, ReactNode } from "react";
import { FaClock, FaCheckCircle, FaPlay, FaTrash } from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";
import { Task } from "../hooks/TasksContext";

interface TaskItemProps {
  task: Task;
  selectedTask: Task | null;
  isEditingTask: number;
  taskNameInput: string;
  setTaskNameInput: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateTaskPomodoros: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    taskId: number,
    pomodoros: number
  ) => void;
  handleUpdateTask: (note: string) => void;
  handleSelectTask: (taskId: number) => void;
  handleDeleteTask: (event: React.MouseEvent, taskId: number) => void;
  startTimer: () => void;
  handleEditTaskKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  children: ReactNode;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  selectedTask,
  isEditingTask,
  taskNameInput,
  setTaskNameInput,
  handleUpdateTaskPomodoros,
  handleUpdateTask,
  handleSelectTask,
  handleDeleteTask,
  startTimer,
  handleEditTaskKeyDown,
  children,
}) => {
  return (
    <li
      key={task.id}
      className={`flex space-x-4 justify-between items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 
        ${
          selectedTask?.id === task.id
            ? "bg-blue-100 border-2 border-blue-500"
            : "hover:bg-gray-100 hover:shadow-lg"
        }`}
      onClick={() => handleSelectTask(task.id)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        // Set editing state and focus on input
      }}
      onBlur={() => {}}
    >
      {isEditingTask === task.id ? (
        <textarea
          id={`task-input-${task.id}`}
          rows={1}
          className="border w-full h-full border-gray-300 rounded-lg p-3 flex-grow resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={taskNameInput}
          onChange={(e) => setTaskNameInput(e.target.value)}
          onKeyDown={handleEditTaskKeyDown}
        />
      ) : (
        <span className="text-lg font-medium flex-grow truncate">
          {task.name}
        </span>
      )}
      <div className="flex space-x-4">
        {task.subtasks.length === 0 ? (
          <PomodorosRating
            value={task.pomodoros}
            completed={task.completedPomodoros}
            onChange={(event, pomodoros) =>
              handleUpdateTaskPomodoros(event, task.id, pomodoros)
            }
          />
        ) : (
          <div className="flex items-center space-x-2">
            <FaClock className="text-red-500 w-6 h-6" />
            <span className="font-semibold">
              {task.subtasks.reduce(
                (total, subtask) =>
                  total + (subtask.pomodoros - subtask.completedPomodoros),
                0
              )}
            </span>
            <FaCheckCircle className="text-green-500 w-6 h-6" />
            <span className="font-semibold">
              {task.subtasks.reduce(
                (total, subtask) => total + subtask.completedPomodoros,
                0
              )}
            </span>
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
          onClick={(event) => handleDeleteTask(event, task.id)}
        />
      </div>
      {children}
    </li>
  );
};

export default TaskItem;
