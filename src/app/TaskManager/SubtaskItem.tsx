import React, { useRef, useState } from "react";
import { FaPen, FaPlay, FaTrash } from "react-icons/fa";
import PomodorosRating from "../PomodorosRating";
import { Subtask } from "../hooks/TasksContext";

interface SubtaskItemProps {
  subtask: Subtask;
  handleUpdateSubtask: (oldSubTask: Subtask) => void;
  handleSelectSubtask: (subTaskId: number) => void;
  handleDeleteSubtask: (subtaskId: number) => void;
  startTimer: () => void;
}

const SubtaskItem: React.FC<SubtaskItemProps> = ({
  subtask,
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

  const handleEditingSubtask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubtask(subtask);
    setTimeout(() => subtaskNameInputRef.current?.focus(), 0);
  };

  return (
    <li
      key={subtask.id}
      className={`flex justify-between items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 hover:bg-gray-100`}
      onClick={(e) => {
        e.stopPropagation();
        handleSelectSubtask(subtask.id);
      }}
      onBlur={handleInputBlur}
    >
      {editingSubtask != null ? (
        <input
          ref={subtaskNameInputRef}
          id={`subtask-input-${subtask.id}`}
          className="border-b-2 text-lg font-medium border-gray-200 bg-transparent shadow-sm focus:outline-none focus:border-gray-500"
          value={editingSubtask.title}
          onChange={(e) =>
            setEditingSubtask({ ...editingSubtask, title: e.target.value })
          }
          onKeyDown={handleEditSubtaskKeyDown}
        />
      ) : (
        <div className="flex space-x-2 items-center">
          <span className="text-lg font-medium flex-grow truncate">
            {subtask.title}
          </span>
          <FaPen
            onClick={handleEditingSubtask}
            className="text-gray-500 cursor-pointer hover:text-gray-600 w-4 h-4"
          ></FaPen>
        </div>
      )}
      <div className="flex items-center space-x-4">
        <PomodorosRating
          value={subtask.pomodorosRequired}
          completed={subtask.pomodorosCompleted}
          onChange={(event, pomodoros) =>
            handleUpdateSubtask({ ...subtask, pomodorosRequired: pomodoros })
          }
        />
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
      </div>
    </li>
  );
};

export default SubtaskItem;
