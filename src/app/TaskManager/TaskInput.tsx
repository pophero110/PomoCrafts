import React, { KeyboardEvent, useRef } from "react";
import { FaExpandAlt, FaCompressAlt, FaPlus } from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";

interface TaskInputProps {
  taskInput: string;
  pomodoros: number;
  handlePomodorosInput: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    pomodoros: number
  ) => void;
  handleTaskInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addTask: () => void;
  isTaskInputExpanded: boolean;
  setIsTaskInputExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const TaskInput: React.FC<TaskInputProps> = ({
  taskInput,
  pomodoros,
  handlePomodorosInput,
  handleTaskInputChange,
  addTask,
  isTaskInputExpanded,
  setIsTaskInputExpanded,
}) => {
  const newTaskTextareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddTaskKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      addTask();
    }
  };

  return (
    <div className="flex mb-4">
      <div className="w-full relative mr-2">
        <textarea
          ref={newTaskTextareaRef}
          rows={isTaskInputExpanded ? 5 : 3}
          className="border w-full h-full border-gray-300 rounded-lg p-3 flex-grow resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a new task..."
          value={taskInput}
          onChange={handleTaskInputChange}
          onKeyDown={handleAddTaskKeyDown}
        />
        {isTaskInputExpanded ? (
          <FaCompressAlt
            onClick={() => setIsTaskInputExpanded(false)}
            className="absolute top-4 right-4 cursor-pointer hover:text-blue-500 transition-colors duration-200"
          />
        ) : (
          <FaExpandAlt
            onClick={() => setIsTaskInputExpanded(true)}
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
        <FaPlus />
      </button>
    </div>
  );
};

export default TaskInput;
