"use client";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Subtask, Task } from "./types"; // Define these types in a separate file or inline
import {
  FaClock,
  FaCheckCircle,
  FaRegPlayCircle,
  FaRegTrashAlt,
  FaExpandAlt,
  FaCompressAlt,
  FaPlus,
} from "react-icons/fa";
import PomodorosRating from "./PomodorosRating";

interface TaskManagerProps {
  tasks: Task[];
  taskInput: string;
  pomodoros: number;
  handlePomodorosInput: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    pomodoros: number
  ) => void;
  handleTaskPomodorosChange: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    taskId: number,
    pomodoros: number
  ) => void;
  handleSubtaskPomodorosChange: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    taskId: number,
    subtaskId: number,
    pomodoros: number
  ) => void;
  subtaskInput: string;
  selectedTask: Task | null;
  selectedSubtask: Subtask | null;
  addTask: () => void;
  addSubtask: (taskId: number) => void;
  handleTaskInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubtaskInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectTask: (taskId: number) => void;
  handleDeleteTask: (event: React.MouseEvent, taskId: number) => void;
  handleSelectSubtask: (taskId: number, subTaskId: number) => void;
  handleDeleteSubtask: (
    event: React.MouseEvent,
    taskId: number,
    subtaskId: number
  ) => void;
  startTimer: () => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  taskInput,
  subtaskInput,
  selectedTask,
  selectedSubtask,
  pomodoros,
  handlePomodorosInput,
  handleSubtaskPomodorosChange,
  handleTaskPomodorosChange,
  addTask,
  addSubtask,
  handleTaskInputChange,
  handleSubtaskInputChange,
  handleSelectTask,
  handleDeleteTask,
  handleSelectSubtask,
  handleDeleteSubtask,
  startTimer,
}) => {
  // Reference for the subtask input field
  const subtaskInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTaskInputExpanded, setIsTaskInputExpanded] =
    useState<Boolean>(false);

  // Function to handle Enter key press
  const handleAddTaskKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default form submission behavior
      addTask(); // Call your addTask function
    }
  };

  // Focus on the subtask input when a task is selected
  useEffect(() => {
    if (selectedTask && subtaskInputRef.current) {
      subtaskInputRef.current.focus();
    }
  }, [selectedTask]); // Dependency on selectedTask

  const handleAddSubtaskKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    taskId: number
  ) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission behavior
      addSubtask(taskId); // Call your addTask function
    }
  };

  const expandTaskInput = () => {
    setIsTaskInputExpanded(true);
  };

  const compressTaskInput = () => {
    setIsTaskInputExpanded(false);
  };

  return (
    <div>
      {/* Task input field */}
      <div className="flex mb-4">
        <div className="w-full relative mr-2">
          <textarea
            ref={textareaRef}
            rows={isTaskInputExpanded ? 5 : 3}
            className="borde w-full h-full border-gray-300 rounded-lg p-3 flex-grow resize-none h-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a new task..."
            value={taskInput}
            onChange={handleTaskInputChange}
            onKeyDown={handleAddTaskKeyDown}
          />
          {isTaskInputExpanded ? (
            <FaCompressAlt
              onClick={compressTaskInput}
              className="absolute top-4 right-4 cursor-pointer hover:text-blue-500 transition-colors duration-200"
            ></FaCompressAlt>
          ) : (
            <FaExpandAlt
              onClick={expandTaskInput}
              className="absolute top-4 right-4 cursor-pointer hover:text-blue-500 transition-colors duration-200"
            />
          )}

          <PomodorosRating
            value={pomodoros}
            onChange={(event, pomodoros) =>
              handlePomodorosInput(event, pomodoros)
            }
            className="absolute bottom-4 right-4"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={addTask}
        >
          <FaPlus></FaPlus>
        </button>
      </div>

      {/* Task list */}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="bg-white shadow-md rounded-md p-4">
            <div
              className={`flex justify-between items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 
                ${
                  selectedTask?.id === task.id
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "hover:bg-gray-100 hover:shadow-lg"
                }`}
              onClick={() => handleSelectTask(task.id)}
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium">{task.name}</span>
                {task.subtasks.length === 0 ? (
                  <PomodorosRating
                    value={task.pomodoros}
                    completed={task.completedPomodoros}
                    onChange={(event, pomodoros) =>
                      handleTaskPomodorosChange(event, task.id, pomodoros)
                    }
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <FaClock className="text-red-500 w-6 h-6" />
                    <span className="font-semibold">
                      {task.subtasks.reduce(
                        (total, subtask) =>
                          total +
                          (subtask.pomodoros - subtask.completedPomodoros),
                        0
                      )}
                    </span>
                    <FaCheckCircle className="text-green-500 w-6 h-6"></FaCheckCircle>
                    <span className="font-semibold">
                      {task.subtasks.reduce(
                        (total, subtask) => total + subtask.completedPomodoros,
                        0
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex space-x-4">
                {task.subtasks.length === 0 && (
                  <FaRegPlayCircle
                    className="text-blue-500 hover:text-blue-600 w-6 h-6 cursor-pointer"
                    onClick={startTimer}
                  ></FaRegPlayCircle>
                )}
                <FaRegTrashAlt
                  className="text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer"
                  onClick={(event) => handleDeleteTask(event, task.id)}
                ></FaRegTrashAlt>
              </div>
            </div>

            {/* Subtask input and list */}
            {selectedTask?.id === task.id && (
              <div className="mt-4">
                <div className="flex mb-2">
                  <input
                    type="text"
                    ref={subtaskInputRef} // Attach ref here
                    className="border border-gray-300 rounded-md p-2 flex-grow mr-2"
                    placeholder="Enter a subtask..."
                    value={subtaskInput}
                    onChange={handleSubtaskInputChange}
                    onKeyDown={(event) =>
                      handleAddSubtaskKeyDown(event, task.id)
                    }
                  />
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    onClick={() => addSubtask(task.id)}
                  >
                    <FaPlus></FaPlus>
                  </button>
                </div>

                <ul className="list-disc space-y-2">
                  {task.subtasks.map((subtask) => (
                    <li
                      key={subtask.id} // Use subtask.id if available for better key management
                      className={`flex justify-between items-center bg-gray-100 shadow-sm rounded-md p-3 hover:bg-gray-200 transition-colors duration-200
                        ${
                          selectedSubtask?.id === subtask.id
                            ? "bg-blue-100 border-2 border-blue-500"
                            : "hover:bg-gray-100 hover:shadow-lg"
                        } 
                        `}
                      onClick={() => handleSelectSubtask(task.id, subtask.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-800">{subtask.name}</span>
                        <div className="flex items-center space-x-1">
                          <PomodorosRating
                            value={subtask.pomodoros}
                            completed={subtask.completedPomodoros}
                            onChange={(event, pomodoros) =>
                              handleSubtaskPomodorosChange(
                                event,
                                task.id,
                                subtask.id,
                                pomodoros
                              )
                            }
                          ></PomodorosRating>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <FaRegPlayCircle
                          className="text-blue-500 hover:text-blue-600 w-6 h-6 cursor-pointer"
                          onClick={startTimer}
                        ></FaRegPlayCircle>
                        <FaRegTrashAlt
                          className="text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer"
                          onClick={(event) =>
                            handleDeleteSubtask(event, task.id, subtask.id)
                          }
                        ></FaRegTrashAlt>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
