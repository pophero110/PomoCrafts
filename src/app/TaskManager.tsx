import React, { KeyboardEvent } from "react";
import { Subtask, Task } from "./types"; // Define these types in a separate file or inline

interface TaskManagerProps {
  tasks: Task[];
  taskInput: string;
  subtaskInput: string;
  selectedTask: Task | null;
  selectedSubtask: Subtask | null;
  addTask: () => void;
  addSubtask: (taskId: number) => void;
  handleTaskInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  addTask,
  addSubtask,
  handleTaskInputChange,
  handleSubtaskInputChange,
  handleSelectTask,
  handleDeleteTask,
  handleSelectSubtask,
  handleDeleteSubtask,
}) => {
  // Function to handle Enter key press
  const handleAddTaskKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission behavior
      addTask(); // Call your addTask function
    }
  };

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
        <input
          type="text"
          className="border border-gray-300 rounded-md p-2 flex-grow mr-2"
          placeholder="Enter a new task..."
          value={taskInput}
          onChange={handleTaskInputChange}
          onKeyDown={handleAddTaskKeyDown}
        />
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
              className={`flex justify-between items-center bg-white shadow-md rounded-md p-4 cursor-pointer transition-all duration-300 
                ${
                  selectedTask?.id === task.id
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "hover:bg-gray-100 hover:shadow-lg"
                }`}
              onClick={() => handleSelectTask(task.id)}
            >
              <span className="text-lg font-medium">{task.name}</span>
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
                      className={`flex cursor-pointer justify-between items-center bg-gray-100 shadow-sm rounded-md p-3 hover:bg-gray-200 transition-colors duration-200
                        ${
                          selectedSubtask?.id === subtask.id
                            ? "bg-blue-100 border-2 border-blue-500"
                            : "hover:bg-gray-100 hover:shadow-lg"
                        } 
                        `}
                      onClick={() => handleSelectSubtask(task.id, subtask.id)}
                    >
                      <span className="text-gray-800">{subtask.name}</span>
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
