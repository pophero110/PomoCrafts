import React, { KeyboardEvent } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";
import { Subtask } from "../types";

interface SubtaskItemProps {
  subtask: Subtask;
  selectedSubtask: Subtask | null;
  isEditingSubtask: number;
  subtaskNameInput: string;
  setSubtaskNameInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubtaskPomodorosChange: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    subtaskId: number,
    pomodoros: number
  ) => void;
  handleSubtaskEditing: (note: string) => void;
  handleSelectSubtask: (subTaskId: number) => void;
  handleDeleteSubtask: (event: React.MouseEvent, subtaskId: number) => void;
  startTimer: () => void;
  handleEditSubtaskKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  selectedSubtask,
  isEditingSubtask,
  subtaskNameInput,
  setSubtaskNameInput,
  handleSubtaskPomodorosChange,
  handleSubtaskEditing,
  handleSelectSubtask,
  handleDeleteSubtask,
  startTimer,
  handleEditSubtaskKeyDown,
}) => {
  return (
    <li
      key={subtask.id}
      className={`flex justify-between items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 
        ${
          selectedSubtask?.id === subtask.id
            ? "bg-blue-100 border-2 border-blue-500"
            : "hover:bg-gray-100 hover:shadow-lg"
        }`}
      onClick={() => handleSelectSubtask(subtask.id)}
      onDoubleClick={(e) => {
        e.stopPropagation();
        // Set editing state and focus on input
      }}
      onBlur={() => {}}
    >
      <div className="flex items-center space-x-4">
        {isEditingSubtask === subtask.id ? (
          <textarea
            id={`subtask-input-${subtask.id}`}
            rows={1}
            className="border w-full h-full border-gray-300 rounded-lg p-3 flex-grow resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={subtaskNameInput}
            onChange={(e) => setSubtaskNameInput(e.target.value)}
            onKeyDown={handleEditSubtaskKeyDown}
          />
        ) : (
          <span className="text-lg font-medium">{subtask.name}</span>
        )}
        <div className="flex items-center space-x-1">
          <PomodorosRating
            value={subtask.pomodoros}
            completed={subtask.completedPomodoros}
            onChange={(event, pomodoros) =>
              handleSubtaskPomodorosChange(event, subtask.id, pomodoros)
            }
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <FaPlay
          className="text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer"
          onClick={startTimer}
        />
        <FaTrash
          className="text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer"
          onClick={(event) => handleDeleteSubtask(event, subtask.id)}
        />
      </div>
    </li>
  );
};

export default SubtaskItem;
