import React from "react";
import { FaClock, FaRegClock } from "react-icons/fa";

// Define types for props
interface PomodorosRatingProps {
  className?: string;
  value: number;
  onChange: (pomodoros: number) => void;
}

function PomodorosRating({ value, onChange, className }: PomodorosRatingProps) {
  const handleClick = (value: number) => {
    onChange(value);
  };

  return (
    <div className={"flex " + className}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          className="cursor-pointer"
        >
          {value >= star ? (
            <FaClock className="text-red-500 w-6 h-6" />
          ) : (
            <FaRegClock className="text-red-400 w-6 h-6" />
          )}
        </span>
      ))}
    </div>
  );
}

export default PomodorosRating;
