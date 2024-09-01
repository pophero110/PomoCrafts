"use client";
import React, { KeyboardEvent, useRef, useState } from "react";
import { FaExpandAlt, FaCompressAlt, FaPlus } from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";
import PriorityRating, { Priority } from "../PriorityRating";
import { TaskState } from "./TaskManager";

interface TaskInputProps {
  addTask: () => void;
  taskState: TaskState;
  setTaskState: React.Dispatch<React.SetStateAction<TaskState>>;
}

const TaskInput: React.FC<TaskInputProps> = ({
  taskState,
  setTaskState,
  addTask,
}) => {
  const newTaskTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [isTaskInputExpanded, setIsTaskInputExpanded] = useState(false);

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
          name="task-name-input"
          ref={newTaskTextareaRef}
          rows={isTaskInputExpanded ? 5 : 3}
          className="border w-full h-full border-gray-300 rounded-lg p-3 flex-grow resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter a new task..."
          value={taskState.name}
          onChange={(e) => {
            setTaskState({ ...taskState, name: e.target.value });
          }}
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

        <PriorityRating
          className={"absolute bottom-4 left-4"}
          selectedPriority={taskState.priority}
          onChange={(priority) => {
            setTaskState({ ...taskState, priority });
          }}
        ></PriorityRating>
        <PomodorosRating
          value={taskState.pomodoros}
          onChange={(event, pomodoros) =>
            setTaskState({ ...taskState, pomodoros })
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
