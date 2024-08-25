"use client";
import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Subtask, Task } from "./types"; // Define these types in a separate file or inline
import { FaClock } from "react-icons/fa";
import PomodorosRating from "./PomodorosRating";

interface TaskManagerProps {
  tasks: Task[];
  taskInput: string;
  pomodoros: number;
  handlePomodorosInput: (pomodoros: number) => void;
  handleTaskPomodorosChange: (taskId: number, pomodoros: number) => void;
  handleSubtaskPomodorosChange: (
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
  handleDeleteTask: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: number
  ) => void;
  handleSelectSubtask: (taskId: number, subTaskId: number) => void;
  handleDeleteSubtask: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    taskId: number,
    subtaskId: number
  ) => void;
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
}) => {
  // Reference for the subtask input field
  const subtaskInputRef = useRef<HTMLInputElement | null>(null);

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

  return (
    <div>
      {/* Task input field */}
      <div className="flex mb-4">
        <div className="w-full relative mr-2">
          <textarea
            className="borde w-full border-gray-300 rounded-lg p-3 flex-grow resize-none h-24 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a new task..."
            value={taskInput}
            onChange={handleTaskInputChange}
            onKeyDown={handleAddTaskKeyDown}
          />
          <PomodorosRating
            value={pomodoros}
            onChange={handlePomodorosInput}
            className="absolute bottom-4 right-4"
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={addTask}
        >
          Add Task
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
                <div className="flex items-center space-x-1">
                  <PomodorosRating
                    value={task.pomodoros - task.completedPomodoros}
                    onChange={(pomodoros) =>
                      handleTaskPomodorosChange(task.id, pomodoros)
                    }
                  ></PomodorosRating>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-red-500"
                  onClick={(event) => handleDeleteTask(event, task.id)} // Add this button
                >
                  Delete
                </button>
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
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={() => addSubtask(task.id)}
                  >
                    Add Subtask
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
                            value={
                              subtask.pomodoros - subtask.completedPomodoros
                            }
                            onChange={(pomodoros) =>
                              handleSubtaskPomodorosChange(
                                task.id,
                                subtask.id,
                                pomodoros
                              )
                            }
                          ></PomodorosRating>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          className="text-red-500"
                          onClick={(event) =>
                            handleDeleteSubtask(event, task.id, subtask.id)
                          }
                        >
                          Delete
                        </button>
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
