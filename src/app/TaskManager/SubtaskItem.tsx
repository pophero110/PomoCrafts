import React, { useRef, useState } from "react";
import { FaCheck, FaPen, FaPlay, FaTrash, FaSave } from "react-icons/fa";
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
  const isSelected = selectedSubtask?.id === subtask.id;

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

  const handleEditingSubtask = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSubtask(subtask);
    setTimeout(() => subtaskNameInputRef.current?.focus(), 0);
  };

  const handleEditingTaskComplete = () => {
    if (editingSubtask) {
      handleUpdateSubtask({ ...editingSubtask });
      setEditingSubtask(null);
    }
  };

  const handleCompleteSubtask = () => {
    handleUpdateSubtask({
      ...subtask,
      pomodorosCompleted: subtask.pomodorosRequired,
    });
  };

  return (
    <li
      key={subtask.id}
      className={`flex justify-between items-center bg-white shadow-md rounded-md p-4 transition-all duration-300 ${
        isSelected
          ? "bg-blue-100 border-2 border-blue-500"
          : "hover:bg-gray-100 hover:shadow-lg"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        handleSelectSubtask(subtask.id);
      }}
    >
      {editingSubtask != null ? (
        <div className={`flex justify-between items-center`}>
          <input
            ref={subtaskNameInputRef}
            id={`subtask-input-${subtask.id}`}
            className="border-b-2 text-lg font-medium max-w-24 border-gray-200 bg-transparent focus:outline-none focus:border-gray-500"
            value={editingSubtask.title}
            onChange={(e) =>
              setEditingSubtask({ ...editingSubtask, title: e.target.value })
            }
            onKeyDown={handleEditSubtaskKeyDown}
          />
          <PomodorosRating
            value={editingSubtask.pomodorosRequired}
            completed={editingSubtask.pomodorosCompleted}
            onChange={(event, pomodoros) =>
              setEditingSubtask({
                ...editingSubtask,
                pomodorosRequired: pomodoros,
              })
            }
          />
        </div>
      ) : (
        <div className="flex space-x-2 items-center">
          <span className="text-lg font-medium max-w-24 truncate">
            {subtask.title}
          </span>
          <PomodorosRating
            mode="Display"
            value={subtask.pomodorosRequired}
            completed={subtask.pomodorosCompleted}
            onChange={() => {}}
          />
        </div>
      )}
      <div className="flex items-center space-x-4">
        <div className="flex space-x-4">
          {editingSubtask ? (
            <FaSave
              onClick={handleEditingTaskComplete}
              className="text-blue-500 cursor-pointer hover:text-blue-600 w-6 h-6"
            ></FaSave>
          ) : (
            <>
              <FaPen
                onClick={handleEditingSubtask}
                className="text-blue-500 cursor-pointer hover:text-blue-600 w-6 h-6"
              ></FaPen>
              <FaCheck
                onClick={handleCompleteSubtask}
                className="text-green-500 cursor-pointer hover:text-green-600 w-6 h-6"
              ></FaCheck>
              <FaPlay
                className="text-blue-500 hover:text-blue-600 w-6 h-6 cursor-pointer"
                onClick={startTimer}
              />
              <FaTrash
                className="text-gray-500 hover:text-gray-600 w-6 h-6 cursor-pointer"
                onClick={(event) => handleDeleteSubtask(subtask.id)}
              />
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default SubtaskItem;
