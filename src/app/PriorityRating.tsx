import React from "react";
import { FaFire, FaCalendarAlt, FaStar } from "react-icons/fa";
import { Priority } from "./hooks/TasksContext";

interface PriorityRatingProps {
  className?: string;
  selectedPriority: Priority;
  onChange: (priority: Priority) => void;
}

export const priorityOptions: {
  [key: string]: {
    label: string;
    value: Priority;
    icon: React.ReactNode;
  };
} = {
  high: {
    label: "High",
    value: "high",
    icon: <FaFire className="text-red-500" />,
  },
  medium: {
    label: "Medium",
    value: "medium",
    icon: <FaStar className="text-yellow-500" />,
  },
  low: {
    label: "Low",
    value: "low",
    icon: <FaCalendarAlt className="text-green-500" />,
  },
};

const PriorityRating: React.FC<PriorityRatingProps> = ({
  className,
  selectedPriority,
  onChange,
}) => {
  return (
    <div className={`flex space-x-2 ${className}`}>
      {Object.keys(priorityOptions).map((key) => {
        const { label, value, icon } = priorityOptions[key];
        return (
          <label
            key={value}
            className={`flex items-center p-1 rounded-md cursor-pointer ${
              selectedPriority === value
                ? "bg-blue-200 border-2 border-blue-500"
                : "bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="priority"
              value={value}
              checked={selectedPriority === value}
              onChange={() => onChange(value)}
              className="sr-only"
            />
            <span
              className={`w-6 h-6 flex items-center justify-center rounded-full`}
            >
              {icon}
            </span>
            {/* <span>{label}</span> */}
          </label>
        );
      })}
    </div>
  );
};

export default PriorityRating;
