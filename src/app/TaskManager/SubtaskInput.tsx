import React, { KeyboardEvent, useRef } from "react";
import { FaPlus } from "react-icons/fa";

interface SubtaskInputProps {
  subtaskInput: string;
  handleSubtaskInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addSubtask: () => void;
  taskId: number;
  handleAddSubtaskKeyDown: (
    event: KeyboardEvent<HTMLInputElement>,
    taskId: number
  ) => void;
}

const SubtaskInput: React.FC<SubtaskInputProps> = ({
  subtaskInput,
  handleSubtaskInputChange,
  addSubtask,
  taskId,
  handleAddSubtaskKeyDown,
}) => {
  const subtaskInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex mb-2">
      <input
        type="text"
        ref={subtaskInputRef}
        className="border border-gray-300 rounded-md p-2 flex-grow mr-2"
        placeholder="Enter a subtask..."
        value={subtaskInput}
        onChange={handleSubtaskInputChange}
        onKeyDown={(event) => handleAddSubtaskKeyDown(event, taskId)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        onClick={addSubtask}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default SubtaskInput;
