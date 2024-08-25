import React from "react";
import { FaClock, FaRegClock, FaCheckCircle } from "react-icons/fa";

// Define types for props
interface PomodorosRatingProps {
  className?: string;
  mode?: "Input" | "Display";
  value: number;
  completed?: number;
  onChange: (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    pomodoros: number
  ) => void;
}

function PomodorosRating({
  value,
  completed = 0,
  onChange,
  mode = "Input",
  className = "",
}: PomodorosRatingProps) {
  const handleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    value: number
  ) => {
    onChange(event, value);
  };

  if (mode === "Display") {
    return (
      <div className={"flex " + className}>
        {Array.from({ length: completed }).map((_, index) => (
          <FaCheckCircle className="text-green-500 w-6 h-6"></FaCheckCircle>
        ))}
        {Array.from({ length: value - completed }).map((_, index) => (
          <FaClock className="text-red-500 w-6 h-6"></FaClock>
        ))}
      </div>
    );
  }
  return (
    <div className={"flex " + className}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={(event) => handleClick(event, star)}
          className="cursor-pointer"
        >
          {completed >= star ? (
            <FaCheckCircle className="text-green-500 w-6 h-6"></FaCheckCircle>
          ) : value >= star ? (
            <FaClock className="text-red-500 w-6 h-6" />
          ) : (
            <FaRegClock className="text-red-400 w-6 h-6 cursor-pointer hover:text-red-500 transition-colors duration-200" />
          )}
        </span>
      ))}
    </div>
  );
}

export default PomodorosRating;
