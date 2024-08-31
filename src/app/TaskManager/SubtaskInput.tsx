import React, { SetStateAction, useRef } from "react";
import { FaPlus } from "react-icons/fa";

interface SubtaskInputProps {
  subtaskState: { name: string; pomodoros: number };
  setSubtaskState: React.Dispatch<
    SetStateAction<{ name: string; pomodoros: number }>
  >;
  handleCreateSubtask: () => void;
}

const SubtaskInput: React.FC<SubtaskInputProps> = ({
  subtaskState,
  setSubtaskState,
  handleCreateSubtask,
}) => {
  const subtaskInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtaskState({ ...subtaskState, name: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateSubtask();
    }
  };

  return (
    <div className="flex mb-2">
      <input
        type="text"
        name="subtask-input"
        ref={subtaskInputRef}
        className="border border-gray-300 rounded-md p-2 flex-grow mr-2"
        placeholder="Enter a subtask..."
        value={subtaskState.name}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={handleCreateSubtask}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default SubtaskInput;
