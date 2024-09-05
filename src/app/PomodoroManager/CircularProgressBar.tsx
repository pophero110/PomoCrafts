import React from "react";
import { Pomodoro } from "../hooks/PomodoroContext";

interface CircularProgressBarProps {
  pomodoro: Pomodoro;
  mode: "pomodoro" | "shortBreak" | "longBreak";
  secondsElapsed: number;
  formattedTime: string; // Pass formatted time as a prop to display in the center
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  pomodoro,
  mode,
  secondsElapsed,
  formattedTime,
}) => {
  const radius = 180;
  const stroke = 20;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Calculate progress
  const progress =
    (secondsElapsed /
      (mode === "pomodoro"
        ? pomodoro.durationInSeconds
        : mode === "shortBreak"
        ? pomodoro.break.shortBreakDurationInSeconds
        : pomodoro.break.longBreakDurationInSeconds)) *
    circumference;

  // Define colors based on mode
  const getColor = () => {
    switch (mode) {
      case "pomodoro":
        return "rgba(34, 197, 94, 1)"; // Green for Pomodoro
      case "shortBreak":
        return "rgba(249, 115, 22, 1)"; // Orange for Short Break
      case "longBreak":
        return "rgba(59, 130, 246, 1)"; // Blue for Long Break
      default:
        return "rgba(34, 197, 94, 1)"; // Default to Green
    }
  };

  const strokeColor = getColor();

  return (
    <div className="relative flex flex-col items-center p-4">
      <svg height={radius * 2} width={radius * 2} className="relative">
        {/* Background Circle */}
        <circle
          stroke="rgba(229, 231, 235, 1)" // Light gray for background
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Foreground Circle for Timer Progress */}
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - progress}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
        {/* Text in the Center for Formatted Time */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="48px"
          fontWeight="bold"
          fill="black"
        >
          {formattedTime}
        </text>
        {/* Indicator for Completed Pomodoros */}
        {mode === "pomodoro" &&
          secondsElapsed >= pomodoro.durationInSeconds && (
            <text
              x="50%"
              y="30%"
              textAnchor="middle"
              dy="1.5em"
              fontSize="24px"
              fontWeight="bold"
              fill="gray"
            >
              Completed
            </text>
          )}
        {/* Pomodoros Completed */}
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          fontSize="18px"
          fontWeight="bold"
          fill="green"
        >
          Pomodoros: {pomodoro.pomodorosCompleted}
        </text>
        {/* Breaks Taken */}
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          fontSize="18px"
          fontWeight="bold"
          fill="blue"
        >
          Breaks: {pomodoro.break.breakCompleted}
        </text>
      </svg>
    </div>
  );
};

export default CircularProgressBar;
