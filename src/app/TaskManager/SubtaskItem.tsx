import React, { KeyboardEvent, useRef, useState } from "react";
import { FaPlay, FaTrash } from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";
import { Subtask } from "../hooks/TasksContext";

interface SubtaskItemProps {
  subtask: Subtask;
  selectedSubtask: Subtask | null;
  handleUpdateSubtask: (oldSubTask: Subtask) => void;
  handleSelectSubtask: (subTaskId: number) => void;
  handleDeleteSubtask: (subtaskId: number) => void;
  startTimer: () => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
  selectedSubtask,
  handleUpdateSubtask,
  handleSelectSubtask,
  handleDeleteSubtask,
  startTimer,
}) => {
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);
  const subtaskNameInputRef = useRef<HTMLInputElement>(null);

  const handleEditSubtaskKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingSubtask) {
        handleUpdateSubtask({ ...editingSubtask });
        setEditingSubtask(null);
      }
    }
  };

  const handleInputBlur = () => {
    if (editingSubtask) {
      handleUpdateSubtask({ ...editingSubtask });
      setEditingSubtask(null);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubtask(subtask);
    setTimeout(() => subtaskNameInputRef.current?.focus(), 0);
  };

  return (
    <li
      key={subtask.id}
      className={`flex justify-between items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 
        ${
          selectedSubtask?.id === subtask.id
            ? "bg-blue-100 border-2 border-blue-500"
            : "hover:bg-gray-100 hover:shadow-lg"
        }`}
      onClick={(e) => {
        e.stopPropagation();
        handleSelectSubtask(subtask.id);
      }}
      onDoubleClick={handleDoubleClick}
      onBlur={handleInputBlur}
    >
      <div className="flex items-center space-x-4">
        {editingSubtask != null ? (
          <input
            ref={subtaskNameInputRef}
            id={`subtask-input-${subtask.id}`}
            className="border w-full h-full border-gray-300 rounded-lg p-3 flex-grow resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={editingSubtask.name}
            onChange={(e) =>
              setEditingSubtask({ ...editingSubtask, name: e.target.value })
            }
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
              setEditingSubtask({ ...subtask, pomodoros })
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
          onClick={(event) => handleDeleteSubtask(subtask.id)}
        />
      </div>
    </li>
  );
};

export default SubtaskItem;
